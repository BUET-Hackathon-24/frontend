import api from '../../lib/axios'

/**
 * AuthService provides methods to handle authentication.
 *
 * @namespace authService
 */

export const authService = {
  /**
   * Logs in a user with the provided credentials.
   *
   * @function
   * @name authService.login
   * @async
   * @param {Object} credentials - The login credentials.
   * @param {string} credentials.username - The username of the user.
   * @param {string} credentials.password - The password of the user.
   * @returns {Promise<Object>} The response data from the login request.
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  /**
   * Logs out the current user.
   *
   * @function
   * @name authService.logout
   * @async
   * @returns {Promise<Object>} The response data from the logout request.
   */
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },
}
