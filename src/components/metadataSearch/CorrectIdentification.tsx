import DialogCenter from '@components/windows/utils/DialogCenter'
import DialogCenterContent from '@components/windows/utils/DialogCenterContent'
import DialogTemplate from '@components/windows/utils/DialogTemplate'
import { useMetadataContext } from 'context/metadata.context';
import React from 'react'
import { useTranslation } from 'react-i18next';
import VerticalResults from './utils/VerticalResults';
import IdentificationResult from './utils/IdentificationResult';
import Loading from '@components/utils/Loading';

function CorrectIdentification() {
  const { t } = useTranslation();
  const { loaded, showCIWindow,setShowCIWindow, identificationResults } = useMetadataContext();

  return (
    <DialogTemplate
      menuOpen={showCIWindow}
      title={t('correctIdentification')}
      cancelAction={() => setShowCIWindow(false)}>
        <DialogCenter>
          <DialogCenterContent>
            {
              loaded && identificationResults && identificationResults.length > 0 ? (
                <VerticalResults>
                  {
                    identificationResults.map((result: any) => (
                      <IdentificationResult key={result.id} result={result} />
                    ))
                  }
                </VerticalResults>
              ) : (
                <Loading />
              )
            }
          </DialogCenterContent>
        </DialogCenter>
      </DialogTemplate>
  )
}

export default React.memo(CorrectIdentification)