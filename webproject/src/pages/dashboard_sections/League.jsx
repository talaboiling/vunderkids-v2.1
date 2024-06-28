import { useTranslation } from 'react-i18next'
const League = () => {
  const { t } = useTranslation();
  return (
    <div className='league'>
        <p style={{width:"80%", margin:"0", marginBottom:"20px"}}>
            {t ('youAreIn')} <strong>{t ('emeraldLeague')}</strong>
        </p>
        {t ('keepItUp')}
    </div>
  )
}

export default League