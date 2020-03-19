import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ProfileCard } from '../../../commons/profile_card/profile_card';
import { ProjectsFront } from './projects_front/projects_front';
import { ProjectsBack } from './projects_back/projects_back';
import { AddButton } from './add_button_rounded/add_button_rounded';
import { ProjectDialog } from './project_dialog/project_dialog';

import { useCallbackOpen } from '../../../hooks/use_callback_open';

import { mapProjectsFromJsonResume } from './data/mapping';
import { DeveloperProfileContext } from '../../../../utils/context/contexts';
import { validateProjectsComplete } from './data/validator';
import { SIDES } from '../../../commons/profile_card/profile_card_side/side';

const ProjectsCardComponent = ({ variant, side }) => {
    const { data, isEditing, setIsEditing, mode } = useContext(DeveloperProfileContext);
    const defaultMappedData = useMemo(() => mapProjectsFromJsonResume(data), [data]);
    const [mappedData, setMappedData] = useState(defaultMappedData);

    const [openNewProjectDialog, setNewProjectDialogOpened, setNewProjectDialogClosed] = useCallbackOpen();

    useEffect(() => {
        setMappedData(defaultMappedData);
    }, [defaultMappedData]);


    const isComplete = useMemo(() => validateProjectsComplete(mappedData), [mappedData]);

    const currentSide = useMemo(() => {
        if (!isComplete && !isEditing) {
            return SIDES.FRONT;
        }
        return side;
    }, [side, isComplete, isEditing]);

    const handleAddButtonClick = useCallback(() => {
        setIsEditing(true);
        setNewProjectDialogOpened();
    }, [mappedData]);

    if (!isComplete && mode !== 'edit') {
        return null;
    }
    return (
        <ProfileCard
            data={mappedData}
            isComplete={isComplete}
            isEditingProfile={isEditing}
            sides={{
                front: props => <ProjectsFront handleAddButtonClick={handleAddButtonClick} {...props} />,
                back: props => <ProjectsBack handleAddButtonClick={handleAddButtonClick} {...props} />
            }}
            variant={variant}
            side={currentSide}
            customEditAction={<AddButton title="Ajouter un projet" onClick={handleAddButtonClick} />}
        >
            <ProjectDialog
                open={openNewProjectDialog}
                onClose={setNewProjectDialogClosed}
                project={mappedData?.projects}
            />
        </ProfileCard>
    );
};

export const ProjectsCard = ProjectsCardComponent;
