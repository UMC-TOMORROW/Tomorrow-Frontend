import palette from '../../styles/theme';

interface CommonButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

function CommonButton({
  label,
  onClick,
  type = 'button',
  className = '',
}: CommonButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        flex justify-center items-center
        px-[10px] gap-[10px]
        w-[328px] h-[50px]
        border rounded-[20px]
        text-[20px] leading-[24px] font-normal
        cursor-pointer mx-auto
        ${className}
      `}
      style={{
        backgroundColor: palette.primary.primary,
        borderColor: palette.primary.primary,
        color: '#FFFFFF',
      }}
    >
      {label}
    </button>
  );
}

export default CommonButton;
