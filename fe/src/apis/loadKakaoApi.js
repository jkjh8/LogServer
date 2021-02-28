import axios from 'axios'

export const kakaoApi = async function () {
  let key
  axios.get(`'http://${window.location.hostname}:3000/auth/kakaokey`).then((err, res) => {
    if (err) return console.log(err)
    key = res.data.key
  })
  const scriptKakao = document.createElement('script')
  scriptKakao.setAttribute('type', 'text/javascript')
  scriptKakao.src = 'https://developers.kakao.com/sdk/js/kakao.js'
  scriptKakao.async = true
  document.getElementsByTagName('head')[0].appendChild(scriptKakao)
}
