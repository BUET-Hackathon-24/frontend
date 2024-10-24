const getItem = (key) => {
  return localStorage.getItem(key)
}

const setItem = (key, value) => {
  localStorage.setItem(key, value)
}
export const remote_api_base = 'htt'
export const remote_base_url = 'https://meetnmarry.com'

export const local_api_base = 'http://172.28.31.70:3000/api/v1'
export const local_base_url = 'http://172.28.31.70:3000/'

const is_local = true

export const api_base = is_local ? local_api_base : remote_api_base
export const base_url = is_local ? local_base_url : remote_base_url

export async function Fetch(url, stuff) {
  console.log('FETCH ->', url, stuff)
  const resp = await fetch(url, stuff)
  return resp
}

export async function clearCache() {
  const d = new Date()
  const ct = d.getTime()
  setItem('lastTime', ct)
  for (var i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key.startsWith('cache-')) {
      localStorage.removeItem(key)
    }
  }
}

export async function getXCached(path, filter) {
  const key = 'cache-' + path + JSON.stringify(filter)
  const data = getItem(key)
  if (data) {
    return JSON.parse(data)
  }
  const res = await getX(path, filter)
  setItem('cache-' + path + JSON.stringify(filter), JSON.stringify(res))
  return res
}

export const getRawAuthToken = () => {
  return localStorage.getItem('authToken')
}

export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token)
}

export const clearAuthToken = () => {
  localStorage.setItem('authToken', '')
}

export function getAuthToken() {
  return 'Bearer ' + localStorage.getItem('authToken').replaceAll('"', '')
}
/**
 * Parses the authentication token and returns the payload as a JSON object.
 *
 * This function retrieves the authentication token, decodes it from Base64Url format,
 * and parses the JSON payload contained within the token.
 *
 * @returns {Object} The parsed JSON payload from the authentication token.
 *
 * @throws {Error} If the token is invalid or cannot be parsed.
 */
export function parseAuthToken() {
  const token = getAuthToken()
  var base64Url = token.split('.')[1]
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )
  return JSON.parse(jsonPayload)
}

export function getUploadedImageURL(x) {
  if (!x) return ''
  if (x.startsWith('http://localhost')) return base_url + x.replace('http://localhost', '')
  if (x.startsWith('http')) return x
  if (x.startsWith('data')) return x
  if (x) return base_url + x
  return ''
}

export async function fetchX(method, path, post, get = null) {
  console.log('fetchX ->', path, JSON.stringify(get))
  var url = `${api_base}/${path}/?`
  if (get) {
    url += '/?'
    try {
      Object.keys(get).forEach((x) => {
        url = url + x + '=' + get[x] + '&'
      })
    } catch {}
  }
  var r
  if (method === 'GET')
    r = await Fetch(url, {
      method: method,
      mode: 'cors',
      headers: {
        Authorization: getAuthToken(),
        'Content-Type': 'application/json',
      },
    })
  else
    r = await Fetch(url, {
      method: method,
      mode: 'cors',
      headers: {
        Authorization: getAuthToken(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    })
  const j = await r.json()
  return j
}

export async function getX(path, filter = null) {
  console.log('getX ->', path, JSON.stringify(filter))
  var url = `${api_base}/${path}`
  if (filter) {
    url += '/?'
    try {
      Object.keys(filter).forEach((x) => {
        url = url + x + '=' + filter[x] + '&'
      })
    } catch {}
  }
  const r = await Fetch(url, {
    cache: 'default',
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: getAuthToken(),
      // "Access-Control-Allow-Origin": "*",
    },
  })
  const j = await r.json()
  return j
}
export async function postX(path, body, filter = null) {
  console.log('postX ->', path, JSON.stringify(filter), JSON.stringify(body))
  var url = `${api_base}/${path}`
  if (filter) {
    url += '/?'
    try {
      Object.keys(filter).forEach((x) => {
        url = url + x + '=' + filter[x] + '&'
      })
    } catch {}
  }
  const r = await Fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: getAuthToken(),
      // "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  })
  const j = await r.json()
  console.log('postX => ', path, body, j)
  return j
}

export async function postXTimed(path, filter, body) {
  console.log('postX ->', path, JSON.stringify(filter), JSON.stringify(body))
  const url = `${api_base}/${path}/?${new URLSearchParams(filter).toString()}`

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000)

  try {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: getAuthToken(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    clearTimeout(timeoutId) // Clear timeout if request completes before timeout

    const jsonData = await response.json()
    return jsonData
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timed out')
      return { message: 'Timeout', severity: 'error' } // Return empty object on timeout
    } else {
      console.error('Error occurred during fetch:', error)
      // Handle other errors
      return { message: 'Timeout', severity: 'error' } // Return empty object on timeout
    }
  }
}

export async function postY(path, body, filter = null) {
  console.log('postY ->', path, JSON.stringify(filter), body)
  var url = `${api_base}/${path}`
  if (filter) {
    url += '/?'
    try {
      Object.keys(filter).forEach((x) => {
        url = url + x + '=' + filter[x] + '&'
      })
    } catch {}
  }
  const r = await Fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: getAuthToken(),
      Accept: 'application/json',
    },
    body: body,
  })
  const j = await r.json()
  return j
}

export async function deleteX(path) {
  console.log('deleteX ->', path)
  var url = `${api_base}/${path}/`

  const r = await Fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: getAuthToken(),
      Accept: 'application/json',
    },
  })
  const j = await r.json()
  return j
}

// export function showToast(response) {
//   var msg = ''
//   if ('errors' in response) {
//     Object.keys(response.errors).forEach((key) => {
//       msg += response.errors[key] + '\n'
//       console.log(key, response.errors[key])
//     })
//     toast.error(msg)
//     return
//   }
//   if ('result' in response && 'message' in response) {
//     if (Array.isArray(response.message)) {
//       response.message.forEach((x) => {
//         msg += x + '\n'
//       })
//     } else msg = response.message
//     if (response.result) toast.success(msg)
//     else toast.error(msg)
//   }
// }

export const saveTokenToStorage = (token) => {
  localStorage.setItem('fcm_token', token)
}

// Function to get token from local storage
export const getTokenFromStorage = () => {
  return localStorage.getItem('fcm_token')
}

const endpoints = {
  signup: async (data) => await postX('register', data),
  login: async (email, password) => await postX('login', { email, password }),
  //TODO: make it explicit
  exchangeToken: async (data) => await postX('auth/exchange-token', data),
  googleAuth: async () => await getX('auth/google'),
  profileInfo: async () => await getX('profile'),

  contactUs: async (name, email, subject, description) =>
    await postX('contact-us', {
      name,
      email,
      subject,
      description,
    }),
  blogs: async () => await getX('blogs'),
  changePassword: async (old_password, password, password_confirmation) =>
    await postX('member/change/password', {
      old_password,
      password,
      password_confirmation,
    }),

  forgotPassword: async (email_or_phone) =>
    await postX('forgot/password', {
      email_or_phone,
      send_code_by: 'email',
    }),
  resetPassword: async (email_or_phone, verification_code, password, password_confirmation) =>
    await postX('reset/password', {
      email_or_phone,
      send_code_by: 'email',
      verification_code,
      password,
      password_confirmation,
    }),
  gallery: async (id) => await getX(`member/gallery/${id}`),
  deleteGalleryImage: async (id) => await getX(`member/gallery/delete/${id}`),
  addGalleryImage: async (data) => await postY('member/gallery', data),
  removeContact: async (id) => await getX(`member/viewed-contacts/delete/${id}`),
  viewedContacts: async () => await getX('member/viewed-contacts'),
  checkContactAccess: async (id) => await getX(`member/check-contact-info-access/${id}`),
  getContactAccess: async (id) => await getX(`member/view-contact-info/${id}`),
  saveFcmToken: async (token) =>
    await postX('member/save-fcmtoken', {
      token,
    }),
  removeFcmToken: async () =>
    await postX('member/remove-fcmtoken', {
      token: getTokenFromStorage(),
    }),
  login: async (user, pass) =>
    await postX('signin', {
      email_or_phone: user,
      password: pass,
    }),
  signup: async (
    on_behalf,
    first_name,
    last_name,
    gender,
    date_of_birth,
    email,
    password,
    password_confirmation
  ) =>
    await postX('signup', {
      on_behalf,
      first_name,
      last_name,
      gender,
      date_of_birth,
      email,
      password,
      password_confirmation,
    }),
  profile: async (id) => {
    if (id) return await getX(`member/public-profile/${id}`)
    else return null
  },
  packages: async () => await getX('packages'),
  myPackageDetails: async () => await getX('member/package-details'),
  chatList: async () => await getX('member/chat-list'),
  chatMessages: async (id) => await getX(`member/chat-view/${id}`),
  sendMessage: async (message, chat_thread_id) =>
    await postX('member/chat-reply', {
      message,
      chat_thread_id,
      attachment: [],
    }),

  myHappyStories: async () => await getX('member/my-happy-stories'),
  createHappyStory: async (data) => {
    console.log('createHappyStory', data)
    return await postY('member/happy-story', data)
  },
  deleteHappyStory: async (id) => await getX(`member/delete-happy-story/${id}`),

  memberListing: async (data) => await postX('member/member-listing', data),

  ignoreUser: async (userId) =>
    await postX('member/add-to-ignore-list', {
      user_id: userId,
    }),
  removeFromIgnoreList: async (userId) =>
    await postX('member/remove-from-ignored-list', {
      user_id: userId,
    }),
  expressInterest: async (userId) =>
    await postX('member/express-interest', {
      user_id: userId,
    }),
  shortlistUser: async (userId) =>
    await postX('member/add-to-shortlist', {
      user_id: userId,
    }),
  removeFromShortlist: async (userId) =>
    await postX('member/remove-from-shortlist', {
      user_id: userId,
    }),
  reportUser: async (user_id, reason) =>
    postX('member/report-member', {
      user_id,
      reason,
    }),
  rejectInterest: async (interest_id) =>
    postX('member/interest-reject', {
      interest_id,
    }),
  acceptInterest: async (interest_id) =>
    postX('member/interest-accept', {
      interest_id,
    }),
  dashboard: async () => await getX('member/dashboard'),

  home: async () => await getX('home'),

  interestRequests: async () => await getX('member/interest-requests'),
  myInterests: async () => await getX('member/my-interests'),
  myShortlists: async () => await getX('member/my-shortlists'),
  ignoreList: async () => await getX('member/ignored-user-list'),

  updateIntroduction: async (introduction) =>
    postX('member/introduction-update', {
      introduction,
    }),
  update_attitude_behavior: async (data) => postX('member/attitude-behavior/update', data),
  update_lifestyles: async (data) => postX('member/life-style/update', data),
  update_families_information: async (data) => postX('member/family-info/update', data),
  update_hobbies_interest: async (data) => postX('member/hobbies/update', data),
  update_physical_attributes: async (data) => postX('member/physical-attributes/update', data),
  update_spiritual_backgrounds: async (data) =>
    postX('member/spiritual-background/update', {
      member_religion_id: data.religion_id,
      member_caste_id: data.caste_id,
      member_sub_caste_id: data.member_sub_caste_id,
      ethnicity: data.ethnicity,
      personal_value: data.personal_value,
      family_value_id: data.family_value_id,
      community_value: data.community_value,
    }),
  countryList: async () => getX('member/countries'),
  update_present_address: async (data) =>
    postX('member/address/update', { ...data, address_type: 'present' }),
  update_permanent_address: async (data) =>
    postX('member/address/update', { ...data, address_type: 'permanent' }),
  update_basic_info: async (data) => {
    delete data['photo']
    return await postX('member/basic-info/update', data)
  },
  update_profile_photo: async (data) => postY('member/basic-info/update', data),
  update_residence_info: async (data) => postX('member/residency-info/update', data),
  update_astrologies: async (data) => postX('member/astronomic/update', data),
  create_education: async (data) => postX('member/education', data),
  update_education: async (id, data) => postX('member/education/update/' + id, data),
  delete_education: async (id) => getX('member/education/delete/' + id),
  create_career: async (data) => postX('member/career', data),
  update_career: async (id, data) => postX('member/career/update/' + id, data),
  delete_career: async (id) => getX('member/career/delete/' + id),
  update_partner_expectation: async (data) => postX('member/partner-expectation/update', data),
  notifications: async () => getX('member/notifications'),

  packageHistory: async () => getX('member/package-purchase-history'),
  packageInvoice: async (package_payment_id) =>
    postX('member/package-purchase-history-invoice', {
      package_payment_id,
    }),
}

export async function getApiResponse(endpoint, ...args) {
  var ep = endpoints[endpoint]
  const res = await ep(...args)
  return res
}

export async function cacheApiResponse(endpoint, args = [], preprocess = null) {
  const ep = endpoints[endpoint]
  var res = await ep(...args)
  if (preprocess) res = preprocess(res)
  localStorage.setItem('cache-' + endpoint, JSON.stringify(res))
  return res
}

export function getApiCache(endpoint) {
  const k = localStorage.getItem('cache-' + endpoint)
  if (k) return JSON.parse(k)
  return null
}
