export default eventHandler(async (event) => {
  const { pathname } = event.context.params || {};

  if (!pathname) {
    throw createError({
      status: 400,
      message: 'Missing pathname'
    });
  }

  const { user } = await requireUserSession(event);

  const blob = await hubBlob().head(pathname);

  if (!blob) {
    throw createError({
      status: 404,
      message: 'Image not found'
    });
  }

  if (blob.customMetadata?.userId !== user.id.toString()) {
    throw createError({
      status: 403,
      message: 'Forbidden'
    });
  }

  return hubBlob().serve(event, pathname);
});
