import logo from '../innoscripta-logo-dark.svg';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <img 
      src={logo} 
      alt="Innoscripta Logo" 
      className={className}
    />
  );
} 