MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

class StyledFont {
    constructor(name, upperCaseStart, lowerCaseStart, numericStart, exceptions) {
        this.name = name;
        this.upperCaseStart = upperCaseStart;
        this.lowerCaseStart = lowerCaseStart;
        this.numericStart = numericStart;
        this.exceptions = exceptions;
    }

    convertText(text) {
        const self = this;
        function convertCharacter(char) {
            var conversionDelta;
            if (/[A-Z]/.test(char)) {
                conversionDelta = self.upperCaseStart.codePointAt(0) - "A".codePointAt(0);
            } else if (/[a-z]/.test(char)) {
                conversionDelta = self.lowerCaseStart.codePointAt(0) - "a".codePointAt(0);
            } else {
                conversionDelta = self.numericStart.codePointAt(0) - "0".codePointAt(0);
            }
            return String.fromCodePoint(char.codePointAt(0) + conversionDelta);
        }

        var result = text;
        for (const [key, value] of Object.entries(self.exceptions)) {
            const regex = new RegExp("[" + key + "]", "g");
            result = result.replace(regex, value);
        }
        return result.replace(/[A-Za-z0-9]/g, convertCharacter);;
    }

    resetConversionDelta(character) {
        const codePoint = character.codePointAt(0);
        if (this.upperCaseStart.codePointAt(0) <= codePoint && this.upperCaseStart.codePointAt(0) + 26 > codePoint) {
            return "A".codePointAt(0) - this.upperCaseStart.codePointAt(0);
        } else if (this.lowerCaseStart.codePointAt(0) <= codePoint && this.lowerCaseStart.codePointAt(0) + 26 > codePoint) {
            return "a".codePointAt(0) - this.lowerCaseStart.codePointAt(0);
        } else if (this.numericStart.codePointAt(0) <= codePoint && this.numericStart.codePointAt(0) + 10 > codePoint) {
            return "0".codePointAt(0) - this.numericStart.codePointAt(0);
        } else {
            for (let [key, value] of Object.entries(this.exceptions)) {
                if (character === value) {
                    return key.codePointAt(0) - value.codePointAt(0);
                }
            }
        }
        return 0;
    }
}

const fonts = [
    new StyledFont("Serif Bold", "\uD835\uDC00", "\uD835\uDC1A", "\uD835\uDFCE", {}),
    new StyledFont("Serif Italic", "\uD835\uDC34", "\uD835\uDC4E", "\u0030", {'h': '\u210E'}),
    new StyledFont("Serif Bold Italic", "\uD835\uDC68", "\uD835\uDC82", "\uD835\uDFCE", {}),
    new StyledFont("Sans-Serif", "\uD835\uDDA0", "\uD835\uDDBA", "\uD835\uDFE2", {}),
    new StyledFont("Sans-Serif Bold", "\uD835\uDDD4", "\uD835\uDDEE", "\uD835\uDFCE", {}),
    new StyledFont("Sans-Serif Italic", "\uD835\uDE08", "\uD835\uDE22", "\uD835\uDFE2", {}),
    new StyledFont("Sans-Serif Bold Italic", "\uD835\uDE3C", "\uD835\uDE56", "\uD835\uDFCE", {}),
    new StyledFont("Script", "\uD835\uDC9C", "\uD835\uDCB6", "\uD835\uDFF6", {'B': '\u212C', 'E': '\u2130', 'F': '\u2131', 'H': '\u210B', 'I': '\u2110', 'L': '\u2112', 'M': '\u2133', 'R': '\u211B', 'e': '\u212F', 'g': '\u210A', 'o': '\u2134'}),
    new StyledFont("Script Bold", "\uD835\uDCD0", "\uD835\uDCEA", "\uD835\uDFF6", {}),
    new StyledFont("Fraktur", "\uD835\uDD04", "\uD835\uDD1E", "\uD835\uDFD8", {'C': '\u212D', 'H': '\u210C', 'I': '\u2111', 'R': '\u211C', 'Z': '\u2128'}),
    new StyledFont("Fraktur Bold", "\uD835\uDD6C", "\uD835\uDD86", "\uD835\uDFCE", {}),
    new StyledFont("Enclosed", "\u24b6", "\u24d0", "\u245F", {'0':'\u24EA'}),
    new StyledFont("Enclosed Negative", "\uD83C\uDD50", "\uD83C\uDD50", "\u2789", {'0':'\uD83C\uDD0C'}),
    new StyledFont("Mono-Space", "\uD835\uDE70", "\uD835\uDE8A", "\uD835\uDFF6", {}),
    new StyledFont("Double-Struck", "\uD835\uDD38", "\uD835\uDD52", "\uD835\uDFD8", {'C': '\u2102', 'H': '\u210D', 'N': '\u2115', 'P': '\u2119', 'Q': '\u211A', 'R': '\u211D', 'Z': '\u2124'})
];

class LinkedInHook {
    isApplicable() {
        return (location.hostname.endsWith('.linkedin.com') || location.hostname === 'linkedin.com')
    }

    initialize() {
        this.toolbar = $('.share-creation-state__additional-toolbar');
    }

    isInjected() {
        return this.toolbar.find('div.fontify-linkedin').length != 0;
    }

    injectInterface() {
        this.toolbar.find('div.share-creation-state__msg-wrapper').before('<div class="fontify-linkedin">\
<span tabindex="-1" id="styled282" class="artdeco-hoverable-trigger artdeco-hoverable-trigger--content-placed-top ember-view">\
<button title="Change Style" aria-label="Change Style" aria-expanded="false" id="styled283" class="artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--2 artdeco-button--tertiary ember-view" type="button">\
<li-icon aria-hidden="true" type="fontify-icon" class="artdeco-button__icon">𝓢</li-icon>\
</button>\
</span>\
</div>\
<div class="fontify-linkedin-font-selector-container">\
<select id="fontify-linkedin-font-selector">' + this.fontsOptions() + '</select>\
</div>');

        $('#styled283').click(function() {
            const selection = window.getSelection();
            if ($(selection.focusNode.parentNode).closest('.ql-editor').length !== 0) {
                const selectedFont = $('#fontify-linkedin-font-selector').val();
                const selectionRange = selection.getRangeAt(0);
                if (selectedFont !== '') {
                    replaceContents(selectionRange, fonts[selectedFont]);
                } else {
                    replaceContents(selectionRange, false);
                }
            }
        });    
    }

    fontsOptions() {
        var options = ['<option value="">Normal</option>'];
        for (var i = 0; i < fonts.length; i++) {
            const font = fonts[i];
            options.push('<option value="' + i + '">' + font.convertText(font.name) + '</option>');
        }
        return options.join('');
    }    
}

class FacebookHook {
    constructor() {
        const self = this;
        document.addEventListener('selectionchange', () => {
            const selection = window.getSelection();
            const parentNode = selection.focusNode.parentNode;
            if (parentNode.className != 'fontify-facebook' && $(parentNode).closest('[contenteditable="true"]').length !== 0) {
                self.selectionRange = selection.getRangeAt(0);
            }
        });
    }

    isApplicable() {
        return (location.hostname.endsWith('.facebook.com') || location.hostname === 'facebook.com')
    }

    initialize() {
        const emojiHook = $("body").find("[aria-label='Emoji']");
        if (emojiHook.length != 0) {
            this.toolbar = emojiHook.parent().parent().parent().parent();
        } else {
            this.toolbar = undefined;
        }
    }

    isInjected() {
        if (!this.toolbar) return;
        return this.toolbar.parent().find('div.fontify-facebook').length != 0;
    }

    injectInterface() {
        if (!this.toolbar) return;
        this.toolbar.before('<div class="fontify-facebook-font-selector">\
<select id="fontify-facebook-font-selector">' + this.fontsOptions() + '</select>\
</div>\
<div class="fontify-facebook" aria-label="Change Style">𝓢</div>');

        const self = this;
        $('.fontify-facebook').click(function() {
            const selectionRange = self.selectionRange;
            if (selectionRange) {
                const selectedFont = $('#fontify-facebook-font-selector').val();
                if (selectedFont !== '') {
                    replaceContents(selectionRange, fonts[selectedFont]);
                } else {
                    replaceContents(selectionRange, false);
                }
            }
        });
        $('#fontify-facebook-font-selector').on('click', function(event) {
            event.stopPropagation();
        });
    }

    fontsOptions() {
        var options = ['<option value="">Normal</option>'];
        for (var i = 0; i < fonts.length; i++) {
            const font = fonts[i];
            options.push('<option value="' + i + '">' + font.convertText(font.name) + '</option>');
        }
        return options.join('');
    }    
}

const hooks = [
    new LinkedInHook(),
    new FacebookHook()
];

const observer = new MutationObserver(function(mutations, observer) {
    hooks.forEach(hook => {
        if (hook.isApplicable()) {
            hook.initialize();
            if (!hook.isInjected()) {
                hook.injectInterface();
            }
        }
    });
});

observer.observe(document, {
    subtree: true,
    attributes: true
});

function replaceContents(selectionRange, font) {
    const startContainer = selectionRange.startContainer;
    const endContainer = selectionRange.endContainer;
    const startOffset = selectionRange.startOffset;
    const endOffset = selectionRange.endOffset;
    const startParent = startContainer.parentNode;
    const endParent = endContainer.parentNode;
    var endOffsetDifference = 0;

    if (startParent === endParent) {
        endOffsetDifference = replaceNodeContents(startContainer, startOffset, endOffset, font);
    } else {
        replaceNodeContents(startContainer, startOffset, startContainer.textContent.length, font);

        endOffsetDifference = replaceNodeContents(endContainer, 0, endOffset, font);

        const middleNodes = getNodesBetween(startContainer, endContainer, selectionRange.commonAncestorContainer);
        middleNodes.forEach(node => {
            replaceNodeContents(node, 0, node.textContent.length, font);
        });
    }
    const selection = window.getSelection();
    selection.removeAllRanges();
    const clonedRange = selectionRange.cloneRange();
    clonedRange.setStart(startContainer, startOffset);
    clonedRange.setEnd(endContainer, endOffset + endOffsetDifference);
    selection.addRange(clonedRange);
}

function replaceNodeContents(container, startOffset, endOffset, font) {
    console.log(container);
    const text = container.textContent;
    console.log(text);
    var textBeforeSelection = text.slice(0, startOffset);
    var selectedText = text.slice(startOffset, endOffset);
    var textAfterSelection = text.slice(endOffset);
    var newText;
    if (font) {
        newText = font.convertText(resetText(selectedText));
    } else {
        newText = resetText(selectedText);
    }
    container.textContent = textBeforeSelection + newText + textAfterSelection;
    return newText.length - selectedText.length;
}

function resetText(text) {
    function resetCharacter(character) {
        var conversionDelta = 0;
        fonts.every(font => {
            conversionDelta = font.resetConversionDelta(character);
            return conversionDelta === 0;
        });
        return String.fromCodePoint(character.codePointAt(0) + conversionDelta);
    }
    return text.replace(/[\uD800-\uDBFF].|[\u210A-\uFFFF]/g, resetCharacter);
}

function getNodesBetween(node1, node2, commonAncestor) {
    if (!commonAncestor) {
        return [];
    }
    var nodes = [];
    var foundNode1 = false;
    var foundNode2 = false;
    function traverse(node) {
        if (node == node1) {
            foundNode1 = true;
        } else if (node == node2) {
            foundNode2 = true;
        } else if (foundNode1 && !foundNode2) {
            nodes.push(node);
        }
        for (let i = 0; i < node.childNodes.length; i++) {
            traverse(node.childNodes[i]);
        }
    }
    traverse(commonAncestor);
    return nodes;
}
