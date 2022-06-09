export const definitionRequire = (field: any, { isValid } : { isValid: boolean }) => {
  const keysDefinitionRequire = (name: any) => {
    isValid = field[name]
      .required(field[name].value)
  }
  Object.keys(field).map(keysDefinitionRequire)
  if (isValid) return field
  return ({
    'Без ПСТ': !isValid
  })
}
