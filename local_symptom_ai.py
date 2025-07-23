     from flask import Flask, request, jsonify
     from transformers import pipeline

     app = Flask(__name__)
generator = pipeline('text-generation', model='microsoft/BioGPT')

     @app.route('/analyze', methods=['POST'])
     def analyze():
         data = request.json
         prompt = data.get('prompt', '')
         result = generator(prompt, max_length=100, num_return_sequences=1)
         return jsonify({'result': result[0]['generated_text']})

     if __name__ == '__main__':
         app.run(port=8000)