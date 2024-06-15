import callApi from '../helpers/apiHelper';

class FighterService {
    #endpoint = 'fighters.json';

    async getFighters() {
        try {
            const apiResult = await callApi(this.#endpoint);
            return apiResult;
        } catch (error) {
            throw error;
        }
    }

    async getFighterDetails(id) {
        // implement this method
        const endpoint = `details/fighter/${id}.json`;
        try {
            const response = await callApi(endpoint);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getFighterInfo(id) {
        try {
            const fighter = await this.getFighterDetails(id);
            return fighter;
        } catch (error) {
            console.error('Error getting fighter info:', error);
            throw error;
        }
    }
}

const fighterService = new FighterService();

export default fighterService;
