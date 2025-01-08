export default eventHandler(async (event) => {
  const { pathname } = event.context.params || {};
  console.log(pathname);
  return hubBlob().serve(event, pathname);
});
