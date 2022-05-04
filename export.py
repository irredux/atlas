from PIL import Image, ImageDraw, ImageFont
import re
import string
import textwrap
import random
class Exporter(object):
    def __init__(self, db, path):
        self.db = db
        self.path = path
    def create_pdf_from_zettel(self, zettel_lst):
        newFilename = f"{''.join(random.choices(string.ascii_uppercase + string.digits, k=25))}.pdf"
        img_lst = []
        html_tag = re.compile("<.*?>|&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-f]{1,6});") # tags and entities
        zettel_box = (1720, 1200)
        zettel_margin = 50
        bg_color = (255, 255, 255)
        txt_color = (24,24,24)
        font = ImageFont.truetype(f"{self.path}/content/fonts/Georgia.ttf", 50)
        for z in zettel_lst:
            if z["img_path"]:
                new_img = Image.open(f"{self.path}{z['img_path']}.jpg")
                img_lst.append(new_img.convert("RGB"))
            else:
                new_img = Image.new("RGB", zettel_box, color=bg_color)
                d = ImageDraw.Draw(new_img)
                d.text((zettel_margin, 80), re.sub(html_tag, "", z["lemma_display"]), font=font, fill=txt_color)

                date_size = d.textsize(re.sub(html_tag, "", z["date_display"]), font=font)
                d.text((zettel_box[0]-zettel_margin-date_size[0], 80), re.sub(html_tag, "", z["date_display"]), font=font, fill=txt_color)

                work_size = d.textsize(z["ac_web"], font=font)
                d.text(((zettel_box[0]/2)-(work_size[0]/2), 200), z["ac_web"], font=font, fill=txt_color)
                word_lst = re.sub(html_tag, "", z["txt"]).split()
                current_line = ""
                line_count = 0
                for word in word_lst:
                    if d.textsize(f"{current_line} {word}", font=font)[0]>zettel_box[0]-(zettel_margin*2):
                        d.text((zettel_margin, 300+(line_count*60)), current_line, font=font, fill=txt_color)
                        current_line=word
                        line_count += 1
                    else: current_line = f"{current_line} {word}"
                img_lst.append(new_img)
        if len(img_lst)>0:
            frst_img = img_lst.pop(0)
            frst_img.save(f"{self.path}/static/temp/{newFilename}", save_all=True, append_images=img_lst)
        return f"/static/temp/{newFilename}"