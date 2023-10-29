
import collections
import json
import xml.etree.ElementTree as etree

import cv2
import numpy as np

wind = etree.parse('./11.svg')
root = wind.getroot()
nodes = wind.findall("{http://www.w3.org/2000/svg}svg")
tree = lambda: collections.defaultdict(tree)
anno = tree()
points = []
anno["info"] = "info"
anno["licenses"] = "license"
anno["annotations"] = []
for child in root:
 
    if child.tag == "{http://www.w3.org/2000/svg}polygon":
        I = np.zeros((1094, 905), dtype=np.uint8)
        pts = []
        p = child.attrib['points'].split()
        for i in p:
            j = i.split(',')
            pts.append([float(j[0]),float(j[1])])
        annotation = tree()
        annotation["label"] = child.attrib['class']
        annotation["segmentation"] = pts
        pts = np.array(pts,np.int32)
        points.append(pts)
        anno["annotations"].append(annotation)
 
a = json.dumps(anno,indent=4)
f2 = open('dict.json', 'w')
f2.write(a)
f2.close()
 
I = cv2.polylines(I,points,True,(100,255,255),2)
cv2.imwrite('I.PNG',I)
cv2.imshow("img", I)
cv2.waitKey(0)
cv2.destroyAllWindows()
