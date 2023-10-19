import { useMutation } from '@tanstack/react-query';
import { sendNoticeThread } from '~/apis/feed';
import type { ThreadContent } from '~/types/feed';

export const useSendNoticeThread = (teamPlaceId: number) => {
  const { mutate, isLoading } = useMutation((threadContent: ThreadContent) => {
    const { content, images } = threadContent;
    const formData = new FormData();

    formData.append('content', content);
    images.forEach((image) => formData.append('images', image));

    return sendNoticeThread(teamPlaceId, formData);
  });

  return {
    mutateSendNoticeThread: mutate,
    isSendNoticeThreadLoading: isLoading,
  };
};
