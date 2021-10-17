import axios from 'axios';

const BASE_API = 'https://report.dataverse.art/dataverse/api/v1';

export async function retryRequest(requestCallback: () => Promise<any>, retryCount = 0) {
  async function executor() {
    try {
      await requestCallback();
    } catch (error) {
      if (retryCount === 0) {
        throw error;
      }

      retryCount--;
      await executor();
    }
  }

  await executor();
}

export async function reportSaveNft(data: { chain: string; token_id: string; contract: string }) {
  try {
    await retryRequest(
      () =>
        axios({
          url: `${BASE_API}/nft`,
          method: 'post',
          data,
        }),
      3,
    );
  } catch (error) {
    console.error(error);
  }
}

export async function fetchNftCount(data: { tokenId: string; contract: string; chain: string }) {
  const { tokenId, contract, chain } = data;
  return axios({
    url: `${BASE_API}/nft/count`,
    params: { tokenId, contract, chain },
  });
}

export async function fetchNftCounts(NFTList: any[]) {
  return axios({
    url: `${BASE_API}/nft/counts`,
    method: 'post',
    data: NFTList,
  });
}