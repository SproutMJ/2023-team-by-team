import { styled } from 'styled-components';
import type { MenuItemProps } from '~/components/common/Menu/MenuItem/MenuItem';

export const Wrapper = styled.li<Omit<MenuItemProps, 'value'>>`
  padding: 8px 12px;

  cursor: pointer;

  text-align: center;

  &:hover {
    background-color: ${({ theme }) => theme.color.GRAY100};
  }

  &.selected {
    background-color: ${({ theme }) => theme.color.GRAY100};
  }

  ${({ css }) => css}
`;
