-- =====================================================
-- 페이지 빌더 테이블 생성 스크립트
-- Builder Tables Migration Script
-- =====================================================

-- -----------------------------------------------------
-- Table: i_builder_page
-- 빌더로 생성된 페이지 정보를 저장하는 테이블
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS i_builder_page (
    idx INT AUTO_INCREMENT PRIMARY KEY COMMENT '페이지 고유 ID',
    page_slug VARCHAR(255) NOT NULL COMMENT '페이지 URL 슬러그',
    page_title VARCHAR(255) NOT NULL COMMENT '페이지 제목',
    page_lang VARCHAR(10) NOT NULL DEFAULT 'ko' COMMENT '페이지 언어 (ko, en, ja, zh)',
    page_status VARCHAR(1) NOT NULL DEFAULT 'D' COMMENT '페이지 상태 (D=Draft, P=Published)',
    page_data LONGTEXT NOT NULL COMMENT '페이지 데이터 (JSON 형식)',
    meta_title VARCHAR(255) DEFAULT NULL COMMENT 'SEO 메타 제목',
    meta_description TEXT DEFAULT NULL COMMENT 'SEO 메타 설명',
    og_image VARCHAR(500) DEFAULT NULL COMMENT 'Open Graph 이미지 URL',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    published_at DATETIME DEFAULT NULL COMMENT '발행일시',
    UNIQUE INDEX idx_slug_lang (page_slug, page_lang) COMMENT '슬러그+언어 유니크 인덱스',
    INDEX idx_status (page_status) COMMENT '상태 인덱스',
    INDEX idx_lang (page_lang) COMMENT '언어 인덱스',
    INDEX idx_created_at (created_at) COMMENT '생성일 인덱스'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='빌더 페이지 테이블';

-- -----------------------------------------------------
-- Table: i_builder_page_version
-- 페이지 버전 히스토리를 저장하는 테이블
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS i_builder_page_version (
    idx INT AUTO_INCREMENT PRIMARY KEY COMMENT '버전 고유 ID',
    page_idx INT NOT NULL COMMENT '페이지 ID (i_builder_page.idx)',
    version_num INT NOT NULL COMMENT '버전 번호',
    page_data LONGTEXT NOT NULL COMMENT '해당 버전의 페이지 데이터 (JSON)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '버전 생성일시',
    created_by VARCHAR(50) DEFAULT NULL COMMENT '버전 생성자',
    INDEX idx_page_idx (page_idx) COMMENT '페이지 ID 인덱스',
    INDEX idx_version_num (page_idx, version_num) COMMENT '페이지별 버전 인덱스',
    CONSTRAINT fk_builder_page_version_page
        FOREIGN KEY (page_idx)
        REFERENCES i_builder_page(idx)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='빌더 페이지 버전 히스토리 테이블';

-- =====================================================
-- 초기 데이터 (선택사항)
-- =====================================================

-- 샘플 페이지 추가 (테스트용)
-- INSERT INTO i_builder_page (page_slug, page_title, page_lang, page_status, page_data) VALUES
-- ('sample-page', '샘플 페이지', 'ko', 'D', '{"sections":[],"footer":null}');

-- =====================================================
-- 참고사항
-- =====================================================
--
-- 1. 환경 변수 설정 필요:
--    백엔드 .env 파일에 다음 추가:
--    GEMINI_API_KEY=your_gemini_api_key_here
--
-- 2. page_status 값:
--    - 'D': Draft (임시저장)
--    - 'P': Published (발행)
--
-- 3. page_lang 값:
--    - 'ko': 한국어
--    - 'en': 영어
--    - 'ja': 일본어
--    - 'zh': 중국어
--
-- 4. page_data JSON 구조:
--    {
--      "sections": [...],  // 섹션 배열
--      "footer": {...}     // 푸터 설정
--    }
-- =====================================================
