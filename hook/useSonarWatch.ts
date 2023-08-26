import useApi from "./use-api"

// Adjust the import path

function useSonarWatch() {
  const apiService = useApi()

  const getAllSolToken = async () => {
    const url = "https://portfolio-api.sonar.watch/v1/token-infos/allByNetwork/solana"

    return await apiService.get(url)
  }

  const getChange = async () => {
    const url = "https://apibackend.sonar.watch/changes"
    const result: any = await apiService.get(url)

    return result.priceChanges
  }

  const filterChange = async (solTokenList: any, listChange: any) => {
    const mergedData = solTokenList
      .map((token: any) => {
        const matchingChange = listChange.find((change: any) => change.address === token.address)

        if (matchingChange) {
          return { name: token.name, image: token.logoURI, ...matchingChange }
        }
      })
      .filter(Boolean)
      .sort((a: any, b: any) => b["1D"] - a["1D"])

    return mergedData
  }

  return { getAllSolToken, getChange, filterChange }
}

export default useSonarWatch
