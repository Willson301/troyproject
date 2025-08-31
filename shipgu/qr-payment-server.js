const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공
app.use(express.static(__dirname));

// 파일 업로드 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// QR코드 결제 요청 처리
app.post('/api/qr-payment', upload.single('screenshot'), (req, res) => {
    try {
        const { 
            paymentMethod, 
            amount, 
            currency, 
            description, 
            userEmail, 
            userName 
        } = req.body;

        // 기본 유효성 검사
        if (!paymentMethod || !amount || !currency) {
            return res.status(400).json({
                success: false,
                error: '필수 정보가 누락되었습니다.',
                details: '결제 방법, 금액, 통화는 필수입니다.'
            });
        }

        // QR코드 결제 처리 로직 (실제 구현 시 결제 게이트웨이 연동)
        const paymentId = `SHIPGU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        console.log(`QR 결제 요청 접수: ${paymentMethod}, ${amount} ${currency}`);
        
        res.json({
            success: true,
            message: 'QR코드 결제 요청이 성공적으로 접수되었습니다.',
            paymentId: paymentId,
            status: '처리중',
            estimatedTime: '1-3분',
            supportedMethods: ['알리페이', '위챗페이', '웨이디엔']
        });

    } catch (error) {
        console.error('QR 결제 처리 오류:', error);
        res.status(500).json({
            success: false,
            error: '서버 오류가 발생했습니다.',
            details: error.message
        });
    }
});

// 결제 상태 조회
app.get('/api/payment-status/:paymentId', (req, res) => {
    const { paymentId } = req.params;
    
    // 실제 구현 시 데이터베이스에서 조회
    res.json({
        paymentId: paymentId,
        status: '완료',
        timestamp: new Date().toISOString(),
        amount: '100.00',
        currency: 'CNY'
    });
});

// 지원되는 결제 방법 조회
app.get('/api/payment-methods', (req, res) => {
    res.json({
        methods: [
            {
                id: 'alipay',
                name: '알리페이',
                description: '중국 최대 모바일 결제 서비스',
                icon: '💰',
                available: true
            },
            {
                id: 'wechatpay',
                name: '위챗페이',
                description: '위챗 통합 결제 서비스',
                icon: '💬',
                available: true
            },
            {
                id: 'weidian',
                name: '웨이디엔',
                description: '웨이디엔 플랫폼 결제',
                icon: '🛒',
                available: true
            }
        ]
    });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 SHIPGU QR코드 결제 서버가 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`📱 QR코드 결제 시스템이 활성화되었습니다.`);
    console.log(`🌐 http://localhost:${PORT} 에서 접속 가능합니다.`);
});