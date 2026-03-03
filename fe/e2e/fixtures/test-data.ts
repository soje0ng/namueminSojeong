export const TEST_CREDENTIALS = {
  admin: {
    email: 'likeweb@likeweb.co.kr',
    password: 'test1!@#$',
  },
  invalidUser: {
    email: 'invalid@test.com',
    password: 'wrongpassword',
  },
};

export const TEST_BOARD_DATA = {
  post: {
    title: 'E2E 테스트 게시글 제목',
    content: 'E2E 테스트 게시글 내용입니다.',
  },
  comment: {
    content: 'E2E 테스트 댓글 내용입니다.',
  },
};

export const TEST_BANNER_DATA = {
  title: 'E2E 테스트 배너',
  linkUrl: 'https://example.com',
};

export const TEST_POPUP_DATA = {
  title: 'E2E 테스트 팝업',
  content: '팝업 내용입니다.',
  width: 400,
  height: 300,
};

export const TEST_MEMBER_DATA = {
  name: 'E2E 테스트 회원',
  email: 'e2etest@test.com',
};

export const TEST_CATEGORY_DATA = {
  name: 'E2E 테스트 카테고리',
};

export const TEST_LEVEL_DATA = {
  name: 'E2E 테스트 레벨',
  level: 5,
};

export const TOAST_MESSAGES = {
  UPDATED: '수정되었습니다.',
  CREATED: '등록되었습니다.',
  DELETED: '삭제되었습니다.',
  SAVED: '저장되었습니다.',
  ORDER_CHANGED: '순서가 변경되었습니다.',
  EXPOSURE_CHANGED: '노출설정이 변경되었습니다.',
  MOVED: '이동되었습니다.',
  LEVEL_CHANGED: '회원등급이 변경되었습니다.',
  WITHDRAWN: '탈퇴 처리되었습니다.',
};

export const ROUTES = {
  login: '/console',
  main: '/console/main',
  board: {
    post: '/console/board/post',
    comment: '/console/board/comment',
  },
  design: {
    banner: '/console/design/banner',
    popup: '/console/design/popup',
  },
  member: {
    list: '/console/member',
    withdrawn: '/console/member/withdrawn',
  },
  menu: {
    category: '/console/menu/category',
  },
  setting: {
    site: '/console/setting/site',
    level: '/console/setting/level',
    policy: '/console/setting/policy',
  },
  statistics: {
    chart: '/console/statistics/chart',
    visitor: '/console/statistics/visitor',
  },
  maintenance: '/console/maintenance',
};
