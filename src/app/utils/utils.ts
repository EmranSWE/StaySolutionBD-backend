/* eslint-disable @typescript-eslint/no-explicit-any */
type UniqueQueryPayload = {
  id: number | string
}
export const getUniqueRecord = async (model: any, id: UniqueQueryPayload) => {
  const result = await model.findUnique({
    where: {
      id: id,
    },
  })
  return result
}

export const updateRecord = async (
  model: any,
  where: UniqueQueryPayload,
  data: any,
) => {
  const result = await model.update({
    where: where,
    data: data,
  })
  return result
}
