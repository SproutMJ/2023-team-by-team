import Text from '~/components/common/Text/Text';
import * as S from './Notification.styled';
import type { NotificationSize, TextSize } from '~/types/size';
import type { TeamPlaceColor } from '~/types/team';

export interface NotificationProps {
  teamPlaceColor: TeamPlaceColor;
  size?: NotificationSize;
  content: string;
}

const Notification = (props: NotificationProps) => {
  const { teamPlaceColor, content, size = 'md' } = props;
  const textSize: Extract<TextSize, 'md' | 'xl'> = size === 'md' ? 'xl' : 'md';
  const isCanHover = /[\r\n]/.test(content) || content.length > 80;

  return (
    <S.Wrapper
      teamPlaceColor={teamPlaceColor}
      className={isCanHover ? 'can-hover' : ''}
      size={size}
    >
      <S.Inner>
        <Text size={textSize} css={S.notification}>
          {content}
        </Text>
      </S.Inner>
    </S.Wrapper>
  );
};

export default Notification;
