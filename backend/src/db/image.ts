import axios from 'axios'
import fs from 'fs'

const generateImage = async (text: string) => {
  const response = await axios.post(
    'https://api.deepai.org/api/text2img',
    {
      text: text,
    },
    {
      headers: {
        'Api-Key': 'fuckoyu',
      },
    }
  )

  const imageUrl = response.data.output_url

  const image = await axios.get(imageUrl, { responseType: 'arraybuffer' })
  fs.writeFileSync('tweet-image.jpg', image.data)
  console.log('image created')

  return 'tweet-image.jpg'
}

export default generateImage
