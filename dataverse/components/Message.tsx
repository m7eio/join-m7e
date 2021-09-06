/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx, keyframes } from '@emotion/react';
import ReactDOM from 'react-dom';

export enum MessageTypes {
  Success = 'Success',
  Info = 'Info',
  Error = 'Error',
}

const animate = keyframes`
  from {
    opacity: 0.5;
    transform: translateX(100px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

interface MessageProps {
  content: any;
  type?: MessageTypes;
}

export const MessageComp = (props: MessageProps) => {
  const TYPE_CSS_MAP = {
    [MessageTypes.Success]: css`
      background: linear-gradient(109.41deg, #6734f733 13.03%, rgba(163, 162, 180, 0.2) 90.68%),
        rgba(123, 238, 104, 0.3);
      box-shadow: inset -6px -6px 12px rgba(255, 255, 255, 0.08),
        inset 6px 6px 12px rgba(0, 0, 0, 0.18);
    `,
    [MessageTypes.Error]: css`
      background: linear-gradient(
          154.49deg,
          rgba(136, 103, 230, 0.2) 5.35%,
          rgba(163, 162, 180, 0.2) 83.85%
        ),
        rgba(200, 90, 96, 0.3);
      box-shadow: inset -6px -6px 12px rgba(255, 255, 255, 0.08),
        inset 6px 6px 12px rgba(0, 0, 0, 0.18);
    `,
    [MessageTypes.Info]: css`
      background: linear-gradient(
          154.49deg,
          rgba(136, 103, 230, 0.2) 5.35%,
          rgba(163, 162, 180, 0.2) 83.85%
        ),
        rgba(255, 216, 79, 0.3);
      box-shadow: inset -6px -6px 12px rgba(255, 255, 255, 0.08),
        inset 6px 6px 12px rgba(0, 0, 0, 0.18);
    `,
  };

  const type: MessageTypes = props.type || MessageTypes.Success;

  return (
    <div
      css={css`
        position: fixed;
        top: 40px;
        right: 50px;
        z-index: 10001;
        background: #111;
        border-radius: 8px;
        animation: ${animate} 0.3s linear;
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 120px;
          padding: 16px 24px;
          font-size: 15px;
          color: white;
          border-radius: 8px;
          ${TYPE_CSS_MAP[type]};
          a {
            color: white;
          }
        `}
      >
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: props.content,
          }}
        />
      </div>
    </div>
  );
};

const message = (props: MessageProps & { duration?: number }) => {
  const holder = document.createElement('div');
  document.body.append(holder);
  const destroy = () => {
    holder.remove();
  };

  setTimeout(() => {
    destroy();
  }, props.duration ?? 3000);

  ReactDOM.render(<MessageComp {...props} />, holder);
};

export default message;
