from llava.model.builder import load_pretrained_model
from llava.mm_utils import get_model_name_from_path
from llava.eval.run_llava import eval_model
import nltk
nltk.download('punkt')
nltk.download('wordnet')
from nltk.translate import bleu
from nltk import word_tokenize
from rouge_score.rouge_scorer import RougeScorer
from nltk.translate import meteor

model_path = "liuhaotian/llava-v1.5-7b"

tokenizer, model, image_processor, context_len = load_pretrained_model(
    model_path=model_path,
    model_base=None,
    # model_base="liuhaotian/llava-v1.5-7b",
    model_name=get_model_name_from_path(model_path)
)

import json
import base64
from PIL import Image
import io

with open("test/ground_truth.json", "r") as f:
    ground_truth = json.load(f)

results = []

i = 0
for entity_set in ground_truth:        
    model_path = "liuhaotian/llava-v1.5-7b"
    prompt = """The person is holding the """ + entity_set["prev_object_name"] + """ in his hand. What will the person do next? Answer with an action and an object."""

    image_file = "test/" + str(i) + ".png"

    args = type('Args', (), {
        "model_path": model_path,
        # "model_base": None,
        "model_base": "liuhaotian/llava-v1.5-7b",
        "model_name": get_model_name_from_path(model_path),
        "query": prompt,
        "conv_mode": None,
        "image_file": image_file,
        "sep": ",",
        "temperature": 0,
        "top_p": None,
        "num_beams": 1,
        "max_new_tokens": 50
    })()

    result = eval_model(args)
    print("---")
    print(result)
    print("---")
    # print(result)
    results.append(result)
    
    i += 1

answers = [x["answer"] for x in ground_truth]

sum_bleu = 0
sum_rouge1 = 0
sum_rouge2 = 0
sum_rougeL = 0
sum_meteor = 0
for result, answer in zip(results, answers):
    # Calculate BLEU score
    result_token = word_tokenize(result)
    answer_token = word_tokenize(answer)
    print()
    bleu_score = bleu(
        [result.split()], 
        answer.split(),
        (1,),
        )

    # Calculate ROUGE score
    scorer = RougeScorer(["rouge1", "rouge2", "rougeL", "rougeLsum"])
    rouge_scores = scorer.score(result, answer)

    # Calculate METEOR score
    meteor_score = round(meteor(
        [result_token],
        answer_token,
        ), 4)

    # Print the scores
    sum_bleu += bleu_score
    sum_rouge1 += rouge_scores["rouge1"].fmeasure
    sum_rouge2 += rouge_scores["rouge2"].fmeasure
    sum_rougeL += rouge_scores["rougeL"].fmeasure
    sum_meteor += meteor_score

print(f"BLEU: {sum_bleu/len(results)}")
print(f"ROUGE-1: {sum_rouge1/len(results)}")
print(f"ROUGE-2: {sum_rouge2/len(results)}")
print(f"ROUGE-L: {sum_rougeL/len(results)}")
print(f"METEOR: {sum_meteor/len(results)}")

result_text = f"BELU : {sum_bleu/len(results)} \n ROUGE-1 : {sum_rouge1/len(results)} \n ROUGE-2 : {sum_rouge2/len(results)} \n ROUGE-L : {sum_rougeL/len(results)} \n METEOR : {sum_meteor/len(results)}"

with open("test/results.txt", "w") as f:
    f.write(result_text)