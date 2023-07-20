import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendSchedule } from '~/apis/schedule';
import type { ScheduleWithoutId } from '~/types/schedule';

export const useSendSchedule = (teamPlaceId: number) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (body: ScheduleWithoutId) => sendSchedule(teamPlaceId, body),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['schedules']);
      },
    },
  );

  return { mutateSendSchedule: mutate };
};
