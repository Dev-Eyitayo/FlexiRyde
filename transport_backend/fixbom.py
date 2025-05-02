import codecs

with codecs.open("data.json", "r", encoding="utf-16") as infile:
    content = infile.read()

with open("data_clean.json", "w", encoding="utf-8") as outfile:
    outfile.write(content)