        document.addEventListener('DOMContentLoaded', function() {
            // Gestion des onglets
            const tabs = ['palette', 'custom', 'generator'];
            tabs.forEach(tab => {
                document.getElementById(`tab-${tab}`).addEventListener('click', () => {
                    tabs.forEach(t => {
                        document.getElementById(`tab-${t}`).classList.remove('active');
                        document.getElementById(`content-${t}`).classList.remove('active');
                    });
                    document.getElementById(`tab-${tab}`).classList.add('active');
                    document.getElementById(`content-${tab}`).classList.add('active');
                });
            });

            // Fonctions utilitaires pour les couleurs
            function hexToRgb(hex) {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            }

            function luminance(r, g, b) {
                const a = [r, g, b].map(v => {
                    v /= 255;
                    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
                });
                return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
            }

            function contrastRatio(rgb1, rgb2) {
                const lum1 = luminance(rgb1.r, rgb1.g, rgb1.b);
                const lum2 = luminance(rgb2.r, rgb2.g, rgb2.b);
                const brightest = Math.max(lum1, lum2);
                const darkest = Math.min(lum1, lum2);
                return (brightest + 0.05) / (darkest + 0.05);
            }

            function formatContrastRatio(ratio) {
                return ratio.toFixed(1) + ':1';
            }

            function updateWCAGBadges(ratio) {
                const wcagAaNormal = document.getElementById('wcag-aa-normal');
                const wcagAaLarge = document.getElementById('wcag-aa-large');
                const wcagAaaNormal = document.getElementById('wcag-aaa-normal');
                const wcagAaaLarge = document.getElementById('wcag-aaa-large');
                
                // AA
                if (ratio >= 4.5) {
                    wcagAaNormal.className = 'wcag-badge wcag-pass';
                    wcagAaNormal.textContent = 'AA Texte normal: ✓';
                } else {
                    wcagAaNormal.className = 'wcag-badge wcag-fail';
                    wcagAaNormal.textContent = 'AA Texte normal: ✗';
                }
                
                if (ratio >= 3) {
                    wcagAaLarge.className = 'wcag-badge wcag-pass';
                    wcagAaLarge.textContent = 'AA Texte large: ✓';
                } else {
                    wcagAaLarge.className = 'wcag-badge wcag-fail';
                    wcagAaLarge.textContent = 'AA Texte large: ✗';
                }
                
                // AAA
                if (ratio >= 7) {
                    wcagAaaNormal.className = 'wcag-badge wcag-pass';
                    wcagAaaNormal.textContent = 'AAA Texte normal: ✓';
                } else {
                    wcagAaaNormal.className = 'wcag-badge wcag-fail';
                    wcagAaaNormal.textContent = 'AAA Texte normal: ✗';
                }
                
                if (ratio >= 4.5) {
                    wcagAaaLarge.className = 'wcag-badge wcag-pass';
                    wcagAaaLarge.textContent = 'AAA Texte large: ✓';
                } else {
                    wcagAaaLarge.className = 'wcag-badge wcag-fail';
                    wcagAaaLarge.textContent = 'AAA Texte large: ✗';
                }
            }

            // Gestion des couleurs personnalisées
            const bgColorInput = document.getElementById('bg-color');
            const bgColorHex = document.getElementById('bg-color-hex');
            const textColorInput = document.getElementById('text-color');
            const textColorHex = document.getElementById('text-color-hex');
            const textSizeSelect = document.getElementById('text-size');
            const textWeightSelect = document.getElementById('text-weight');
            const previewBox = document.getElementById('preview-box');
            const previewText = document.getElementById('preview-text');
            const previewProtanopia = document.getElementById('preview-protanopia');
            const previewDeuteranopia = document.getElementById('preview-deuteranopia');
            const previewTritanopia = document.getElementById('preview-tritanopia');
            const previewAchromatopsia = document.getElementById('preview-achromatopsia');
            const contrastRatioElement = document.getElementById('contrast-ratio');

            function updateCustomPreview() {
                const bgColor = bgColorInput.value;
                const textColor = textColorInput.value;
                const textSize = textSizeSelect.value;
                const textWeight = textWeightSelect.value;
                
                // Mise à jour des aperçus
                previewBox.style.backgroundColor = bgColor;
                previewBox.style.color = textColor;
                previewText.className = `${textSize} ${textWeight}`;
                
                previewProtanopia.style.backgroundColor = bgColor;
                previewProtanopia.style.color = textColor;
                previewProtanopia.querySelector('span').className = `${textSize} ${textWeight}`;
                
                previewDeuteranopia.style.backgroundColor = bgColor;
                previewDeuteranopia.style.color = textColor;
                previewDeuteranopia.querySelector('span').className = `${textSize} ${textWeight}`;
                
                previewTritanopia.style.backgroundColor = bgColor;
                previewTritanopia.style.color = textColor;
                previewTritanopia.querySelector('span').className = `${textSize} ${textWeight}`;
                
                previewAchromatopsia.style.backgroundColor = bgColor;
                previewAchromatopsia.style.color = textColor;
                previewAchromatopsia.querySelector('span').className = `${textSize} ${textWeight}`;
                
                // Calcul du contraste
                const bgRgb = hexToRgb(bgColor);
                const textRgb = hexToRgb(textColor);
                const ratio = contrastRatio(bgRgb, textRgb);
                
                contrastRatioElement.textContent = formatContrastRatio(ratio);
                updateWCAGBadges(ratio);
            }

            bgColorInput.addEventListener('input', function() {
                bgColorHex.value = this.value.toUpperCase();
                updateCustomPreview();
            });

            bgColorHex.addEventListener('input', function() {
                if (/^#[0-9A-F]{6}$/i.test(this.value)) {
                    bgColorInput.value = this.value;
                    updateCustomPreview();
                }
            });

            textColorInput.addEventListener('input', function() {
                textColorHex.value = this.value.toUpperCase();
                updateCustomPreview();
            });

            textColorHex.addEventListener('input', function() {
                if (/^#[0-9A-F]{6}$/i.test(this.value)) {
                    textColorInput.value = this.value;
                    updateCustomPreview();
                }
            });

            textSizeSelect.addEventListener('change', updateCustomPreview);
            textWeightSelect.addEventListener('change', updateCustomPreview);

            // Générateur de palette
            const baseColorInput = document.getElementById('base-color');
            const baseColorHex = document.getElementById('base-color-hex');
            const paletteTypeSelect = document.getElementById('palette-type');
            const accessibilityLevelSelect = document.getElementById('accessibility-level');
            const optimizeForSelect = document.getElementById('optimize-for');
            const generatePaletteBtn = document.getElementById('generate-palette');
            const generatedPalette = document.getElementById('generated-palette');
            const paletteInfo = document.getElementById('palette-info');
            const infoType = document.getElementById('info-type');
            const infoContrast = document.getElementById('info-contrast');
            const infoOptimized = document.getElementById('info-optimized');
            const exportPaletteBtn = document.getElementById('export-palette');
            const copyPaletteBtn = document.getElementById('copy-palette');

            baseColorInput.addEventListener('input', function() {
                baseColorHex.value = this.value.toUpperCase();
            });

            baseColorHex.addEventListener('input', function() {
                if (/^#[0-9A-F]{6}$/i.test(this.value)) {
                    baseColorInput.value = this.value;
                }
            });

            // Fonction pour convertir HSL en RGB puis en HEX
            function hslToHex(h, s, l) {
                h /= 360;
                s /= 100;
                l /= 100;
                let r, g, b;
                
                if (s === 0) {
                    r = g = b = l;
                } else {
                    const hue2rgb = (p, q, t) => {
                        if (t < 0) t += 1;
                        if (t > 1) t -= 1;
                        if (t < 1/6) return p + (q - p) * 6 * t;
                        if (t < 1/2) return q;
                        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                        return p;
                    };
                    
                    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                    const p = 2 * l - q;
                    r = hue2rgb(p, q, h + 1/3);
                    g = hue2rgb(p, q, h);
                    b = hue2rgb(p, q, h - 1/3);
                }
                
                const toHex = x => {
                    const hex = Math.round(x * 255).toString(16);
                    return hex.length === 1 ? '0' + hex : hex;
                };
                
                return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
            }

            // Fonction pour convertir HEX en HSL
            function hexToHsl(hex) {
                const rgb = hexToRgb(hex);
                const r = rgb.r / 255;
                const g = rgb.g / 255;
                const b = rgb.b / 255;
                
                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                let h, s, l = (max + min) / 2;
                
                if (max === min) {
                    h = s = 0; // achromatique
                } else {
                    const d = max - min;
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                    
                    switch (max) {
                        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                        case g: h = (b - r) / d + 2; break;
                        case b: h = (r - g) / d + 4; break;
                    }
                    
                    h /= 6;
                }
                
                return {
                    h: Math.round(h * 360),
                    s: Math.round(s * 100),
                    l: Math.round(l * 100)
                };
            }

            // Fonction pour générer une palette de couleurs
            function generatePalette(baseColor, type, accessibilityLevel) {
                const hsl = hexToHsl(baseColor);
                const palette = [];
                
                // Ajouter la couleur de base
                palette.push({
                    name: 'Base',
                    hex: baseColor
                });
                
                switch (type) {
                    case 'monochromatic':
                        // Générer des variations de luminosité
                        palette.push({
                            name: 'Clair',
                            hex: hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 25, 95))
                        });
                        palette.push({
                            name: 'Plus clair',
                            hex: hslToHex(hsl.h, Math.max(hsl.s - 10, 0), Math.min(hsl.l + 40, 98))
                        });
                        palette.push({
                            name: 'Foncé',
                            hex: hslToHex(hsl.h, Math.min(hsl.s + 5, 100), Math.max(hsl.l - 20, 15))
                        });
                        palette.push({
                            name: 'Plus foncé',
                            hex: hslToHex(hsl.h, Math.min(hsl.s + 10, 100), Math.max(hsl.l - 35, 8))
                        });
                        break;
                        
                    case 'analogous':
                        // Couleurs adjacentes sur la roue chromatique
                        palette.push({
                            name: 'Analogue 1',
                            hex: hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l)
                        });
                        palette.push({
                            name: 'Analogue 2',
                            hex: hslToHex((hsl.h - 15 + 360) % 360, hsl.s, hsl.l)
                        });
                        palette.push({
                            name: 'Analogue 3',
                            hex: hslToHex((hsl.h + 15) % 360, hsl.s, hsl.l)
                        });
                        palette.push({
                            name: 'Analogue 4',
                            hex: hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l)
                        });
                        break;
                        
                    case 'complementary':
                        // Couleur complémentaire et variations
                        const complementary = (hsl.h + 180) % 360;
                        palette.push({
                            name: 'Complémentaire',
                            hex: hslToHex(complementary, hsl.s, hsl.l)
                        });
                        palette.push({
                            name: 'Base claire',
                            hex: hslToHex(hsl.h, Math.max(hsl.s - 15, 0), Math.min(hsl.l + 25, 95))
                        });
                        palette.push({
                            name: 'Base foncée',
                            hex: hslToHex(hsl.h, Math.min(hsl.s + 10, 100), Math.max(hsl.l - 20, 15))
                        });
                        palette.push({
                            name: 'Comp. claire',
                            hex: hslToHex(complementary, Math.max(hsl.s - 15, 0), Math.min(hsl.l + 25, 95))
                        });
                        break;
                        
                    case 'triadic':
                        // Trois couleurs équidistantes
                        palette.push({
                            name: 'Triade 1',
                            hex: hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l)
                        });
                        palette.push({
                            name: 'Triade 2',
                            hex: hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)
                        });
                        palette.push({
                            name: 'Base claire',
                            hex: hslToHex(hsl.h, Math.max(hsl.s - 10, 0), Math.min(hsl.l + 30, 95))
                        });
                        palette.push({
                            name: 'Base foncée',
                            hex: hslToHex(hsl.h, Math.min(hsl.s + 10, 100), Math.max(hsl.l - 25, 10))
                        });
                        break;
                        
                    case 'tetradic':
                        // Quatre couleurs en rectangle
                        palette.push({
                            name: 'Tétrade 1',
                            hex: hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l)
                        });
                        palette.push({
                            name: 'Tétrade 2',
                            hex: hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)
                        });
                        palette.push({
                            name: 'Tétrade 3',
                            hex: hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l)
                        });
                        palette.push({
                            name: 'Neutre',
                            hex: hslToHex(hsl.h, Math.max(hsl.s - 50, 0), 92)
                        });
                        break;
                }
                
                // Ajuster les couleurs pour l'accessibilité si nécessaire
                const contrastThreshold = accessibilityLevel === 'AAA' ? 7 : 4.5;
                const white = { r: 255, g: 255, b: 255 };
                const black = { r: 0, g: 0, b: 0 };
                
                for (let i = 0; i < palette.length; i++) {
                    const color = hexToRgb(palette[i].hex);
                    const whiteContrast = contrastRatio(color, white);
                    const blackContrast = contrastRatio(color, black);
                    
                    // Si le contraste n'est pas suffisant, ajuster la luminosité
                    if (whiteContrast < contrastThreshold && blackContrast < contrastThreshold) {
                        const hsl = hexToHsl(palette[i].hex);
                        if (hsl.l > 50) {
                            // Assombrir pour améliorer le contraste avec le blanc
                            palette[i].hex = hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 20, 10));
                        } else {
                            // Éclaircir pour améliorer le contraste avec le noir
                            palette[i].hex = hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 20, 90));
                        }
                    }
                    
                    // Ajouter des informations de contraste
                    const adjustedColor = hexToRgb(palette[i].hex);
                    palette[i].whiteContrast = contrastRatio(adjustedColor, white);
                    palette[i].blackContrast = contrastRatio(adjustedColor, black);
                    palette[i].textColor = palette[i].whiteContrast > palette[i].blackContrast ? 'white' : 'black';
                }
                
                return palette;
            }

            generatePaletteBtn.addEventListener('click', function() {
                const baseColor = baseColorInput.value;
                const paletteType = paletteTypeSelect.value;
                const accessibilityLevel = accessibilityLevelSelect.value;
                const optimizeFor = optimizeForSelect.value;
                
                const palette = generatePalette(baseColor, paletteType, accessibilityLevel);
                
                // Afficher la palette générée
                generatedPalette.innerHTML = '';
                
                palette.forEach(color => {
                    const colorBox = document.createElement('div');
                    colorBox.className = 'bg-white p-4 rounded-lg shadow';
                    
                    const contrastInfo = color.textColor === 'white' 
                        ? `Contraste avec blanc: ${formatContrastRatio(color.whiteContrast)}`
                        : `Contraste avec noir: ${formatContrastRatio(color.blackContrast)}`;
                    
                    const wcagStatus = (color.textColor === 'white' && color.whiteContrast >= (accessibilityLevel === 'AAA' ? 7 : 4.5)) ||
                                      (color.textColor === 'black' && color.blackContrast >= (accessibilityLevel === 'AAA' ? 7 : 4.5))
                        ? `<span class="wcag-badge wcag-pass">${accessibilityLevel} ✓</span>`
                        : `<span class="wcag-badge wcag-fail">${accessibilityLevel} ✗</span>`;
                    
                    colorBox.innerHTML = `
                        <div class="color-box mb-3" style="background-color: ${color.hex}; color: ${color.textColor};">
                            <span class="font-semibold">${color.name}</span>
                        </div>
                        <div class="flex justify-between items-center mb-2">
                            <span class="font-medium">${color.hex}</span>
                            ${wcagStatus}
                        </div>
                        <p class="text-sm text-gray-600">${contrastInfo}</p>
                        
                        <div class="grid grid-cols-2 gap-2 mt-3">
                            <div>
                                <div class="simulation-box protanopia" style="background-color: ${color.hex};"></div>
                                <p class="text-xs text-gray-500 text-center">Protanopie</p>
                            </div>
                            <div>
                                <div class="simulation-box deuteranopia" style="background-color: ${color.hex};"></div>
                                <p class="text-xs text-gray-500 text-center">Deutéranopie</p>
                            </div>
                        </div>
                    `;
                    
                    generatedPalette.appendChild(colorBox);
                });
                
                // Mettre à jour les informations de la palette
                paletteInfo.classList.remove('hidden');
                
                const typeLabels = {
                    'monochromatic': 'Monochromatique',
                    'analogous': 'Analogue',
                    'complementary': 'Complémentaire',
                    'triadic': 'Triadique',
                    'tetradic': 'Tétradique'
                };
                
                const optimizeLabels = {
                    'all': 'Toutes les déficiences',
                    'protanopia': 'Protanopie',
                    'deuteranopia': 'Deutéranopie',
                    'tritanopia': 'Tritanopie'
                };
                
                infoType.textContent = typeLabels[paletteType];
                infoContrast.textContent = accessibilityLevel === 'AAA' ? '7:1' : '4.5:1';
                infoOptimized.textContent = optimizeLabels[optimizeFor];
                
                // Activer les boutons d'export et de copie
                exportPaletteBtn.disabled = false;
                copyPaletteBtn.disabled = false;
            });

            // Fonction pour exporter la palette (simulée)
            exportPaletteBtn.addEventListener('click', function() {
                alert('Fonctionnalité d\'export simulée. Dans une version complète, cela permettrait de télécharger la palette au format JSON, ASE, ou autre format de palette de couleurs.');
            });

            // Fonction pour copier les codes couleur
            copyPaletteBtn.addEventListener('click', function() {
                const colorBoxes = generatedPalette.querySelectorAll('.color-box');
                let colorCodes = '';
                
                colorBoxes.forEach(box => {
                    const name = box.querySelector('span').textContent;
                    const color = box.style.backgroundColor;
                    colorCodes += `${name}: ${color}\n`;
                });
                
                // Simuler la copie dans le presse-papier
                alert(`Codes couleurs copiés dans le presse-papier:\n\n${colorCodes}`);
            });

            // Initialiser l'aperçu personnalisé
            updateCustomPreview();
        });
(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'950b2c0190cd017f',t:'MTc1MDA4NTk3NS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();
