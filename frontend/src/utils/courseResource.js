export const getSubjectResources = (subject) => {
  const resources = Array.isArray(subject?.resourceFiles)
    ? subject.resourceFiles.filter((resource) => resource?.filePath || resource?.url)
    : [];

  const legacyFile = subject?.resourceFile?.file;
  const legacyUrl = subject?.resourceFile?.url;

  if (legacyFile?.filePath && !resources.some((resource) => resource?.filePath === legacyFile.filePath)) {
    resources.push(legacyFile);
  }

  if (legacyUrl && !resources.some((resource) => resource?.url === legacyUrl)) {
    resources.push({
      fileName: subject?.resourceFile?.name || "Resource link",
      filePath: legacyUrl,
      url: legacyUrl,
      resourceType: "url",
    });
  }

  return resources;
};

export const hasSubjectResources = (subject) => getSubjectResources(subject).length > 0;
