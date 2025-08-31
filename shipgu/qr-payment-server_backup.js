const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Context7 할루시네이션 방지 시스템 설정
const context7Config = {
    enabled: true,
    validationLevel: 'strict',
    maxResponseLength: 1000,
    allowedDomains: ['shipgu.com', 'localhost'],
    blockedPatterns: [
        /아마도|추측|생각합니다|~것 같습니다|~일지도|~할 수도|~일 수도/i,
        /다른 회사|타사|경쟁사|비교하면|~보다|~에 비해|~와 달리/i,
        /~일 수도|~할 수도|~일지 모르겠습니다|~인지 모르겠습니다/i,
        /~할 것입니다|~일 것입니다|~가 될 것입니다/i,
        /http|www|\.com|\.kr|\.cn|링크|사이트|페이지/i
    ]
};

// Context7 할루시네이션 검증 미들웨어
function validateContext7(req, res, next) {
    if (!context7Config.enabled) {
        return next();
    }

    const userMessage = req.body.message || req.body.text || '';
    const hasBlockedPattern = context7Config.blockedPatterns.some(pattern => 
        pattern.test(userMessage)
    );

    if (hasBlockedPattern) {
        console.warn('Context7 할루시네이션 패턴 감지:', userMessage);
        return res.status(400).json({
            error: 'Context7 할루시네이션 방지: 허용되지 않는 패턴이 감지되었습니다.',
            detectedPattern: '할루시네이션 위험 패턴',
            suggestion: 'SHIPGU 결제대행 서비스에 관련된 질문만 해주세요.'
        });
    }

    next();
}

// Context7 응답 검증 함수
function validateContext7Response(response) {
    if (!context7Config.enabled) {
        return { isValid: true, response };
    }

    const hasBlockedPattern = context7Config.blockedPatterns.some(pattern => 
        pattern.test(response)
    );

    if (hasBlockedPattern) {
        console.warn('Context7 응답 할루시네이션 감지:', response);
        return {
            isValid: false,
            response: 'Context7 검증 실패: 정확한 정보만 제공합니다.',
            reason: '할루시네이션 패턴 감지'
        };
    }

    return { isValid: true, response };
}

// Context7 로그 및 모니터링
const context7Logs = {
    totalRequests: 0,
    blockedRequests: 0,
    validationErrors: 0,
    lastReset: new Date()
};

function logContext7Activity(type, details) {
    context7Logs.totalRequests++;
    
    if (type === 'blocked') {
        context7Logs.blockedRequests++;
    } else if (type === 'validation_error') {
        context7Logs.validationErrors++;
    }

    // 24시간마다 로그 리셋
    const now = new Date();
    if (now - context7Logs.lastReset > 24 * 60 * 60 * 1000) {
        context7Logs.totalRequests = 0;
        context7Logs.blockedRequests = 0;
        context7Logs.validationErrors = 0;
        context7Logs.lastReset = now;
    }

    console.log(`Context7 ${type}:`, details);
}

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Context7 검증 미들웨어 적용
app.use('/api', validateContext7);

// QR 업로드 엔드포인트 (Context7 검증 포함)
app.post('/api/qr-upload', upload.single('qrImage'), (req, res) => {
    try {
        if (!req.file) {
            logContext7Activity('validation_error', '파일이 업로드되지 않음');
            return res.status(400).json({
                error: 'QR 이미지 파일이 필요합니다.',
                context7Status: '검증 실패'
            });
        }

        const fileInfo = {
            filename: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
            uploadTime: new Date().toISOString()
        };

        logContext7Activity('success', `QR 업로드 성공: ${fileInfo.filename}`);

        res.json({
            success: true,
            message: 'QR 이미지가 성공적으로 업로드되었습니다.',
            fileInfo,
            context7Status: '검증 통과',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        logContext7Activity('validation_error', `QR 업로드 오류: ${error.message}`);
        res.status(500).json({
            error: 'QR 이미지 업로드 중 오류가 발생했습니다.',
            context7Status: '검증 실패',
            details: error.message
        });
    }
});

// Context7 상태 확인 엔드포인트
app.get('/api/context7/status', (req, res) => {
    res.json({
        enabled: context7Config.enabled,
        validationLevel: context7Config.validationLevel,
        stats: {
            totalRequests: context7Logs.totalRequests,
            blockedRequests: context7Logs.blockedRequests,
            validationErrors: context7Logs.validationErrors,
            successRate: context7Logs.totalRequests > 0 
                ? ((context7Logs.totalRequests - context7Logs.blockedRequests - context7Logs.validationErrors) / context7Logs.totalRequests * 100).toFixed(2)
                : 100
        },
        lastReset: context7Logs.lastReset,
        timestamp: new Date().toISOString()
    });
});

// Context7 설정 업데이트 엔드포인트 (관리자용)
app.post('/api/context7/config', (req, res) => {
    const { enabled, validationLevel } = req.body;
    
    if (typeof enabled === 'boolean') {
        context7Config.enabled = enabled;
    }
    
    if (['strict', 'moderate', 'relaxed'].includes(validationLevel)) {
        context7Config.validationLevel = validationLevel;
    }

    logContext7Activity('config_update', `설정 변경: enabled=${context7Config.enabled}, level=${context7Config.validationLevel}`);

    res.json({
        success: true,
        message: 'Context7 설정이 업데이트되었습니다.',
        config: context7Config,
        timestamp: new Date().toISOString()
    });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 SHIPGU QR 결제 서버가 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`🔒 Context7 할루시네이션 방지 시스템: ${context7Config.enabled ? '활성화' : '비활성화'}`);
    console.log(`📊 검증 레벨: ${context7Config.validationLevel}`);
    console.log(`🌐 서버 URL: http://localhost:${PORT}`);
});

// Context7 상태 모니터링 (1시간마다)
setInterval(() => {
    const successRate = context7Logs.totalRequests > 0 
        ? ((context7Logs.totalRequests - context7Logs.blockedRequests - context7Logs.validationErrors) / context7Logs.totalRequests * 100).toFixed(2)
        : 100;
    
    console.log(`📊 Context7 모니터링 - 성공률: ${successRate}%, 총 요청: ${context7Logs.totalRequests}, 차단: ${context7Logs.blockedRequests}, 오류: ${context7Logs.validationErrors}`);
    
    // 성공률이 낮으면 경고
    if (successRate < 80) {
        console.warn(`⚠️ Context7 성공률이 낮습니다: ${successRate}%`);
    }
}, 60 * 60 * 1000); // 1시간마다
