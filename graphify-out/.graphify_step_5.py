import sys, json
from graphify.build import build_from_json
from graphify.cluster import score_all
from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.report import generate
from pathlib import Path

extraction = json.loads(Path('graphify-out/.graphify_extract.json').read_text(encoding="utf-8-sig"))
detection  = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding="utf-8-sig"))
analysis   = json.loads(Path('graphify-out/.graphify_analysis.json').read_text(encoding="utf-8-sig"))

G = build_from_json(extraction)
communities = {int(k): v for k, v in analysis['communities'].items()}
cohesion = {int(k): v for k, v in analysis['cohesion'].items()}
tokens = {'input': extraction.get('input_tokens', 0), 'output': extraction.get('output_tokens', 0)}

labels = {
    0: "Frontend UI & Audio",
    1: "Frontend Dependencies",
    2: "Backend Schemas",
    3: "Temp Repo Package",
    4: "API & Data Services",
    5: "Backend CRUD Operations",
    6: "Frontend TS Config",
    7: "Temp Repo TS Config",
    8: "Backend Main & DB",
    9: "Backend ORM Models",
    10: "Frontend Layout",
    11: "Temp Repo Layout",
    12: "Temp Repo UI",
    13: "Claude Config",
    14: "Frontend ESLint",
    15: "Frontend Next Config",
    16: "Frontend PostCSS",
    17: "Temp Repo ESLint",
    18: "Temp Repo Next Config",
    19: "Temp Repo PostCSS",
    20: "Audio Downloader",
    21: "NextJS Types"
}

questions = suggest_questions(G, communities, labels)

report = generate(G, communities, cohesion, labels, analysis['gods'], analysis['surprises'], detection, tokens, '.', suggested_questions=questions)
Path('graphify-out/GRAPH_REPORT.md').write_text(report, encoding="utf-8")
Path('graphify-out/.graphify_labels.json').write_text(json.dumps({str(k): v for k, v in labels.items()}, ensure_ascii=False), encoding="utf-8")
print('Report updated with community labels')
