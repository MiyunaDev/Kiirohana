export async function fetchData(url: string, options?: any) {
    try {
        return cordova.plugin.http.get(
            url,
            {...options},
            {},  // optional headers
            function (response: any) {
                console.log("Sukses:", response.status, response.data);
                return response
            },
            function (response: any) {
                console.error("Gagal:", response.status, response.error);
                throw Error(response.error)
            }
        );
    } catch (error: any) {
        console.log("Err", `\nFetch data failed: ${error.message}`);
        throw Error(error.message)
    }
}