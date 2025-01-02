import DialogCenter from '@components/windows/utils/DialogCenter'
import DialogCenterContent from '@components/windows/utils/DialogCenterContent'
import DialogTemplate from '@components/windows/utils/DialogTemplate'
import { useMetadataContext } from 'context/metadata.context';
import React from 'react'
import { useTranslation } from 'react-i18next';
import VerticalResults from './utils/VerticalResults';
import EpisodeGroupResult from './utils/EpisodeGroupResult';
import Loading from '@components/utils/Loading';

function EpisodeGroups() {
  const { t } = useTranslation();
  const { loaded, showEGWindow, setShowEGWindow, episodeGroupsResults } = useMetadataContext();

  return (
    <DialogTemplate
      menuOpen={showEGWindow}
      title={t('changeEpisodesGroup')}
      cancelAction={() => setShowEGWindow(false)}>
        <DialogCenter>
          <DialogCenterContent>
            {
              loaded && episodeGroupsResults && episodeGroupsResults.length > 0 ? (
                <VerticalResults>
                  {
                    episodeGroupsResults.map((result: any) => (
                      <EpisodeGroupResult key={result.id} result={result} />
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

export default React.memo(EpisodeGroups)