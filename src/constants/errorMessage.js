const ERROR_PREFIX = '[ERROR]';

export const ERROR_MESSAGE = Object.freeze({
  NOT_EXIST_PRODUCT: `\n${ERROR_PREFIX} 존재하지 않는 상품입니다. 다시 입력해 주세요.\n`,
  OVER_QUANTITY: `\n${ERROR_PREFIX} 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.\n`,
  NOT_MATCH_FORMAT: `\n${ERROR_PREFIX} 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.\n`,
  FALSE_INPUT: `\n${ERROR_PREFIX} 잘못된 입력입니다. 다시 입력해 주세요.\n`,
});
