export type Messages = {
  id: number;
  chatId: number;
  text: string;
  creatorId: number;
  createdAt: Date;
  updatedAt: Date;
  repliedMessageId: number;
  status: number;
  forwardedChatId: number;
  forwardedFromUserId: number;
};
