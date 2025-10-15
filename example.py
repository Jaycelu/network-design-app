##python
import requests

url = "https://aihubmix.com/v1/chat/completions"
headers={
  "Authorization": "Bearer <AIHUBMIX_API_KEY>",  # Replace with the key you generated in AIhubmix
  "APP-Code": "WTPN3476",  # Replace with your 6-digit referral code
  "Content-Type": "application/json"
}
data={  
  "model": "gpt-4o",
  "messages": [
    {
      "role": "user",
      "content": "What is the meaning of life?"
    }
  ]
}

response = requests.post(url, headers=headers, json=data)
print(response.json())

##Typescript
fetch('https://aihubmix.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    "Authorization": "Bearer <AIHUBMIX_API_KEY>",
    "APP-Code": "WTPN3476",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    "model": "gpt-4o",
    "messages": [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ]
  })
})