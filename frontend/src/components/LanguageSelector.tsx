import { Button, ButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('user-language', lng);
  };

  return (
    <ButtonGroup variant="outlined" size="medium" aria-label="language selector">
      <Button
        onClick={() => changeLanguage('en')}
        variant={i18n.language === 'en' ? 'contained' : 'outlined'}
      >
        EN
      </Button>
      <Button
        onClick={() => changeLanguage('es')}
        variant={i18n.language === 'es' ? 'contained' : 'outlined'}
      >
        ES
      </Button>
    </ButtonGroup>
  );
};

export default LanguageSelector;
