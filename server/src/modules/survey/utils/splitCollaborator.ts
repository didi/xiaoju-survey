export const splitCollaborators = (collaboratorList) => {
  const newCollaborator = [],
    existsCollaborator = [];
  for (const collaborator of collaboratorList) {
    if (collaborator._id) {
      existsCollaborator.push(collaborator);
    } else {
      newCollaborator.push(collaborator);
    }
  }
  return {
    newCollaborator,
    existsCollaborator,
  };
};
