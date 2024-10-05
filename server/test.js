const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000');

ws.on('open', () => {
    console.log('Connected to the server');

    ws.send(JSON.stringify({ event: 'JOIN_LOBBY', lobby: '1234' }))

    ws.send(JSON.stringify({ event: "PLAYER_STATUS_UPDATE", status: 'READY' }))

    ws.on('message', (message) => {
        const { event, ...data } = JSON.parse(message);

        if (event == 'GAME_STATUS_UPDATE' && data.status == 'start') {
            const codeString = `
        #include <stdio.h>
    
        // Function to perform Bubble Sort
        void bubbleSort(int arr[], int n) {
            for (int i = 0; i < n - 1; i++) {
                for (int j = 0; j < n - i - 1; j++) {
                    // Swap if the element found is greater than the next element
                    if (arr[j] > arr[j + 1]) {
                        int temp = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = temp;
                    }
                }
            }
        }
    
        // Function to print an array
        void printArray(int arr[], int n) {
            for (int i = 0; i < n; i++) {
                printf("%d ", arr[i]);
            }
            printf("\\n");
        }
    
        int main() {
            int n;
    
            // Read the number of integers to sort
            scanf("%d", &n);
    
            int arr[n]; // Declare an array to hold the integers
    
            // Read the integers from the user
            for (int i = 0; i < n; i++) {
                scanf("%d", &arr[i]);
            }
    
            // Sort the array
            bubbleSort(arr, n);
    
            // Print the sorted array
            printArray(arr, n);
    
            return 0;
        }
        `;

            ws.send(JSON.stringify({ event: 'SEND_CODE', problem: "example", language: 'C', code: codeString }));
        }
    })


});

// Handle messages from the server
ws.on('message', (message) => {
    console.log('Received:', message.toString());
});
