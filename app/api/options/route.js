export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const option = searchParams.get("option");
  
    // Mock data based on the option value
    const data =
      option === "option1"
        ? [
            { id: 1, title: "Box 1", image: "https://via.placeholder.com/150/92c952" },
            { id: 2, title: "Box 2", image: "https://via.placeholder.com/150/771796" },
          ]
        : [
            { id: 3, title: "Box 3", image: "https://via.placeholder.com/150/d32776" },
            { id: 4, title: "Box 4", image: "https://via.placeholder.com/150/f66b97" },
          ];
  
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  }
  