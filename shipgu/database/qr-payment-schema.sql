-- SHIPGU QR코드 결제 시스템 데이터베이스 스키마
-- PostgreSQL 12+ 지원

-- 확장 기능 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 고객 테이블
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kakao_user_id VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(200) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 대화 세션 테이블
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kakao_user_id VARCHAR(100) NOT NULL REFERENCES customers(kakao_user_id),
    state VARCHAR(50) NOT NULL DEFAULT 'WAITING_QR',
    turn_count INTEGER DEFAULT 0,
    last_event_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_state CHECK (state IN (
        'WAITING_QR', 'WAITING_AMOUNT', 'QUOTED', 'VA_ISSUED', 'PAID', 'CANCELLED'
    )),
    CONSTRAINT valid_turn_count CHECK (turn_count >= 0 AND turn_count <= 20)
);

-- 파일 테이블 (QR 이미지 등)
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    kind VARCHAR(20) NOT NULL DEFAULT 'qr',
    storage_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_size INTEGER,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_kind CHECK (kind IN ('qr', 'receipt', 'other'))
);

-- 주문 테이블
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    amount_cny DECIMAL(10,2) NOT NULL,
    base_rate DECIMAL(10,4) NOT NULL,
    markup_per_cny DECIMAL(10,4) NOT NULL DEFAULT 7.0,
    applied_rate DECIMAL(10,4) NOT NULL,
    quote_krw INTEGER NOT NULL,
    est_margin_krw INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'QUOTED',
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_status CHECK (status IN (
        'QUOTED', 'VA_ISSUED', 'PAID', 'CANCELLED', 'EXPIRED'
    )),
    CONSTRAINT valid_amount CHECK (amount_cny > 0),
    CONSTRAINT valid_rate CHECK (base_rate > 0 AND markup_per_cny >= 0)
);

-- 결제 테이블
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    bank VARCHAR(100),
    account_no VARCHAR(100),
    depositor VARCHAR(200),
    expire_at TIMESTAMP WITH TIME ZONE,
    paid_amount INTEGER,
    paid_at TIMESTAMP WITH TIME ZONE,
    tx_id VARCHAR(200),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_provider CHECK (provider IN ('virtual_account', 'alipay', 'wechat', 'weidian')),
    CONSTRAINT valid_status CHECK (status IN ('PENDING', 'PAID', 'EXPIRED', 'CANCELLED'))
);

-- 감사 로그 테이블
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source VARCHAR(50) NOT NULL,
    conversation_id UUID REFERENCES conversations(id),
    order_id UUID REFERENCES orders(id),
    payment_id UUID REFERENCES payments(id),
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_source CHECK (source IN ('kakao', 'webhook', 'admin', 'system'))
);

-- 인덱스 생성
CREATE INDEX idx_customers_kakao_user_id ON customers(kakao_user_id);
CREATE INDEX idx_conversations_kakao_user_id ON conversations(kakao_user_id);
CREATE INDEX idx_conversations_state ON conversations(state);
CREATE INDEX idx_conversations_created_at ON conversations(created_at);
CREATE INDEX idx_files_conversation_id ON files(conversation_id);
CREATE INDEX idx_orders_conversation_id ON orders(conversation_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_account_no ON payments(account_no);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_audit_logs_conversation_id ON audit_logs(conversation_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 업데이트 트리거 생성
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 뷰 생성: 결제 현황 요약
CREATE VIEW payment_summary AS
SELECT 
    c.kakao_user_id,
    c.display_name,
    COUNT(o.id) as total_orders,
    SUM(CASE WHEN o.status = 'PAID' THEN 1 ELSE 0 END) as completed_orders,
    SUM(CASE WHEN o.status = 'QUOTED' THEN 1 ELSE 0 END) as pending_orders,
    SUM(o.quote_krw) as total_quoted_amount,
    SUM(CASE WHEN o.status = 'PAID' THEN o.quote_krw ELSE 0 END) as total_paid_amount,
    AVG(o.applied_rate) as avg_exchange_rate,
    MAX(o.created_at) as last_order_date
FROM customers c
LEFT JOIN conversations conv ON c.kakao_user_id = conv.kakao_user_id
LEFT JOIN orders o ON conv.id = o.conversation_id
GROUP BY c.id, c.kakao_user_id, c.display_name;

-- 함수: 환율 계산
CREATE OR REPLACE FUNCTION calculate_quote(
    p_amount_cny DECIMAL,
    p_base_rate DECIMAL,
    p_markup_per_cny DECIMAL DEFAULT 7.0
)
RETURNS TABLE(
    applied_rate DECIMAL,
    quote_krw INTEGER,
    est_margin_krw INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p_base_rate + p_markup_per_cny as applied_rate,
        ROUND(p_amount_cny * (p_base_rate + p_markup_per_cny))::INTEGER as quote_krw,
        ROUND(p_amount_cny * p_markup_per_cny)::INTEGER as est_margin_krw;
END;
$$ LANGUAGE plpgsql;

-- 샘플 데이터 삽입 (개발용)
INSERT INTO customers (kakao_user_id, display_name, phone) VALUES
('kakao_user_123', '홍길동', '010-1234-5678'),
('kakao_user_456', '김철수', '010-2345-6789'),
('kakao_user_789', '이영희', '010-3456-7890')
ON CONFLICT (kakao_user_id) DO NOTHING;

-- 권한 설정
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
