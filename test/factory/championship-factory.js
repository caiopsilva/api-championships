import Championship from '../../db/models/Championship'

export default async () => {
  const championship = await new Championship({
    name: 'championship-test'
  }).save()

  return championship.toJSON()
}
