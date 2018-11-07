/**
 * @service LoL
 */

const
  config = require.main.require('./config'),
  axios = require('axios');

class LoLApi {
  /**
   * Fetches basic information to LoL API such as profile icon, account ID and summoner ID
   * @async
   * @param {string} summonerName - Summoner name
   * @returns {Promise<Object>} Summoner data
   */
  getSummonerByName(summonerName) {
    return axios.get(`https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}`, {
      params: {
        api_key: config.LoL
      }
    })
      .then(response => ({
        code: response.status,
        summoner: response.data
      }))
      // .then(response => console.log(response))
      .catch(err => ({
        code: err.response.status,
        message: err.response.statusText
      }));
      // .catch(err => console.log(err));
  }

  /**
   * Fetches information to LoL API such as static datas versions
   * @async
   * @returns {Promise<Object>} Versions object
   */
  getStaticDataUrls() {
    let Riot = {DDragon: {}};
    return axios.get('https://ddragon.leagueoflegends.com/realms/euw.js')
      .then(response => {
        eval(response.data);
        return Riot.DDragon.m;
      })
      .catch(err => console.log(err));
  }

  /**
   * Retrieves the picture of the current summoner icon
   * @async
   * @param {string} summoner - Summoner name
   * @returns {Object} iconUrl and iconId
   */
  async getSummonerIcon(summonerName) {
    const { summoner } = await this.getSummonerByName(summonerName)
    const { n } = await this.getStaticDataUrls();
    return {
      data: {
        iconUrl:`http://ddragon.leagueoflegends.com/cdn/${n.profileicon}/img/profileicon/${summoner.profileIconId}.png`,
        iconId: summoner.profileIconId
      },
      code: 301
    }
  }
}

module.exports = new LoLApi();