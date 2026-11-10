from pathlib import Path

root = Path(__file__).resolve().parents[1]
app = (root / "app.js").read_text()
integration = (root / "integration.js").read_text()
html = (root / "index.html").read_text()
sw = (root / "sw.js").read_text()

checks = {
    "pre-visualizacao provisoria disponivel": 'data-action="show-provisional-evolution"' in html and "window.showProvisionalEvolution" in integration,
    "edicao manual disponivel": 'data-action="edit-evolution"' in html and "window.saveEvolutionEdit" in integration,
    "exportacao PDF disponivel": 'data-action="pdf-evolution"' in html and "window.printEvolutionPdf" in integration,
    "historico completo consulta API": "window.showHistory=async" in integration and "'/patients/'+encodeURIComponent(id)+'/evolutions'" in integration,
    "novo ciclo preserva texto editado": "if(!cur.generatedTextEdited)cur.generatedText=buildEvolution()" in integration and "text:archivedText" in integration,
    "alta salva antes de encerrar": "await enqueueSave()" in integration and "await api('/patients/'+encodeURIComponent(id)+'/discharge'" in integration,
    "cache atualizado para arquivos da versao": "uti-check-static-v46" in sw and "'./integration.js'" in sw,
    "botao de alta tem rotulo explicito": '>Registrar alta</button>' in html,
}

for label, passed in checks.items():
    print(f"{'OK' if passed else 'FALHOU'} - {label}")

if not all(checks.values()):
    raise SystemExit(1)
