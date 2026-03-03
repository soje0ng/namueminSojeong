module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'i_category_board',
        {
            parent_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                primaryKey: true,
            },
            b_list_cnt: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: '게시글리스트갯수',
            },
            b_column_title: {
                type: DataTypes.STRING(10),
                allowNull: true,
                comment: '제목 노출여부',
            },
            b_column_date: {
                type: DataTypes.STRING(10),
                allowNull: true,
                comment: '날짜 노출여부',
            },
            b_column_view: {
                type: DataTypes.STRING(10),
                allowNull: true,
                comment: '조회수 노출여부',
            },
            b_column_recom: {
                type: DataTypes.STRING(10),
                allowNull: true,
                comment: '추천수 노출여부',
            },
            b_column_file: {
                type: DataTypes.STRING(10),
                allowNull: true,
                comment: '첨부파일 노출여부',
            },
            b_thumbnail_with: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: '썸네일가로사이즈',
            },
            b_thumbnail_height: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: '썸네일세로사이즈',
            },
            b_thumbnail: {
                type: DataTypes.STRING(1),
                allowNull: true,
                comment: '썸네일이미지구분',
            },
            b_read_lv: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: '읽기권한',
            },
            b_write_lv: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: '쓰기권한',
            },
            b_group: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: '게시판구분',
            },
            b_secret: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: '비밀글설정여부',
            },
            b_reply: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: '답변작성여부',
            },
            b_reply_lv: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: '답변작성권한',
            },
            b_comment: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: '댓글쓰기여부',
            },
            b_comment_lv: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: '댓글쓰기권한',
            },
            b_write_alarm: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: '알림수신정보문자',
            },
            b_write_send: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: '알림수신정보메일',
            },
            b_write_sms: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: '알림수신정보문자',
            },
            b_alarm: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: '게시알림사용여부',
            },
            b_alarm_phone: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: '게시알림전화번호',
            },
            b_top_html: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: '상단HTML',
            },
            b_template: {
                type: DataTypes.STRING(1),
                allowNull: true,
                comment: '게시글템플릿적용',
            },
            b_template_text: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: '템플릿내용',
            },
            use_yn: {
                type: DataTypes.STRING(1),
                allowNull: true,
                comment: '카테고리사용여부',
            },
            b_gallery_type: {
                type: DataTypes.STRING(1),
                allowNull: true,
                comment: '갤러리구분',
            },
            b_alarm_email: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: '게시알림이메일',
            },
        },
        {
            sequelize,
            tableName: 'i_category_board',
            timestamps: false,
        },
    );
};
