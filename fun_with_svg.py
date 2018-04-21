#!/usr/bin/env python3
import drawSvg as draw

# Subclass DrawingBasicElement if it cannot have child nodes
# Subclass DrawingParentElement otherwise
# Subclass DrawingDef if it must go between <def></def> tags in an SVG
class Hyperlink(draw.DrawingParentElement):
    TAG_NAME = 'a'
    def __init__(self, href, target=None, **kwargs):
        # Other init logic...
        # Keyword arguments to super().__init__() correspond to SVG node
        # arguments: stroke_width=5 -> stroke-width="5"
        super().__init__(href=href, target=target, **kwargs)

d = draw.Drawing(100, 100, origin='center')

# Create hyperlink
hlink = Hyperlink('https://www.python.org')
# Add child elements
hlink.append(draw.Text('Hyperlink', 10, 0,0, center=0.6, fill='black'))

# Draw and display
d.append(hlink)
d.setRenderSize(200)
d.savePng('fun.png')
