import os

out_dir = "public/images/cases/custom"
os.makedirs(out_dir, exist_ok=True)

# 50 cases specifications
CASES = [
    # Budget
    ("case_budget_first_blood", "FIRST BLOOD", "Budget", "#ef4444", "dagger_slash"),
    ("case_budget_blueprint", "BLUEPRINT", "Budget", "#3b82f6", "schematic_grid"),
    ("case_budget_low_cost", "LOW COST", "Budget", "#10b981", "wireframe_cube"),
    ("case_budget_pixel", "PIXEL", "Budget", "#8b5cf6", "pixel_diamond"),
    ("case_budget_frostbite", "FROSTBITE", "Budget", "#06b6d4", "ice_crystal"),
    ("case_budget_redline", "REDLINE", "Budget", "#dc2626", "racing_stripes"),
    ("case_budget_neon", "NEON", "Budget", "#ec4899", "synth_triangle"),
    ("case_budget_toxic", "TOXIC", "Budget", "#84cc16", "biohazard_tri"),
    ("case_budget_glitch", "GLITCH", "Budget", "#a855f7", "glitch_bars"),
    ("case_budget_after_dark", "AFTER DARK", "Budget", "#6366f1", "crescent_sphere"),
    ("case_budget_black_ice", "BLACK ICE", "Budget", "#0ea5e9", "angular_glacier"),
    ("case_budget_underground", "UNDERGROUND", "Budget", "#f59e0b", "hazard_chevrons"),
    
    # Standard
    ("case_standard_bloodline", "BLOODLINE", "Standard", "#b91c1ccase_fix", "helix_ribbon"),
    ("case_standard_cyberpunk", "CYBERPUNK", "Standard", "#f43f5e", "cyber_aperture"),
    ("case_standard_void", "VOID", "Standard", "#475569", "event_horizon"),
    ("case_standard_venom", "VENOM", "Standard", "#22c55e", "viper_fangs"),
    ("case_standard_hyperdrive", "HYPERDRIVE", "Standard", "#38bdf8", "warp_singularity"),
    ("case_standard_aureate", "AUREATE", "Standard", "#eab308", "gold_faceted_box"),
    ("case_standard_phantom", "PHANTOM", "Standard", "#94a3b8", "stealth_facet"),
    ("case_standard_nightfall", "NIGHTFALL", "Standard", "#38bdf8", "lunar_eclipse"),
    ("case_standard_overdrive", "OVERDRIVE", "Standard", "#f97316", "combustion_arc"),
    ("case_standard_crimson", "CRIMSON", "Standard", "#e11d48", "ruby_cluster"),
    ("case_standard_whiteout", "WHITEOUT", "Standard", "#f8fafc", "monolithic_shard"),
    ("case_standard_black_label", "BLACK LABEL", "Standard", "#52525b", "matte_seal"),
    
    # Premium
    ("case_premium_royalty", "ROYALTY", "Premium", "#d946ef", "sovereign_crown"),
    ("case_premium_diamond", "DIAMOND", "Premium", "#38bdf8", "brilliant_diamond"),
    ("case_premium_obsidian", "OBSIDIAN", "Premium", "#64748b", "vitreous_glass"),
    ("case_premium_emperor", "EMPEROR", "Premium", "#eab308", "sunburst_wreath"),
    ("case_premium_celestial", "CELESTIAL", "Premium", "#818cf8", "constellation_orbits"),
    ("case_premium_gold_rush", "GOLD RUSH", "Premium", "#facc15", "bullion_isometric"),
    ("case_premium_divinity", "DIVINITY", "Premium", "#f43f5e", "sacred_circles"),
    ("case_premium_inferno", "INFERNO", "Premium", "#ea580c", "flame_vector"),
    ("case_premium_sovereign", "SOVEREIGN", "Premium", "#a855f7", "platinum_scepter"),
    ("case_premium_eclipse", "ECLIPSE", "Premium", "#64748b", "corona_halo"),
    
    # Special
    ("case_special_knife_hunt", "KNIFE HUNT", "Special", "#f59e0b", "tactical_blade"),
    ("case_special_butterfly", "BUTTERFLY", "Special", "#ec4899", "balisong_profile"),
    ("case_special_karambit", "KARAMBIT", "Special", "#8b5cf6", "curved_claw"),
    ("case_special_glove_box", "GLOVE BOX", "Special", "#10b981", "gauntlet_mesh"),
    ("case_special_awp_only", "AWP ONLY", "Special", "#3b82f6", "sniper_reticle"),
    ("case_special_ak_47_only", "AK-47 ONLY", "Special", "#ef4444", "rifle_profile"),
    ("case_special_desert_eagle", "DESERT EAGLE", "Special", "#f97316", "heavy_slide"),
    ("case_special_red_collection", "RED COLLECTION", "Special", "#dc2626", "crimson_prism"),
    ("case_special_purple_collection", "PURPLE COLLECTION", "Special", "#a855f7", "violet_spectrograph"),
    ("case_special_golden_touch", "GOLDEN TOUCH", "Special", "#eab308", "gold_fingerprint"),
    
    # High Tier
    ("case_high_tier_blackout", "BLACKOUT", "High Tier", "#D7FF64", "stealth_monolith"),
    ("case_high_tier_millionaire", "MILLIONAIRE", "High Tier", "#10b981", "vault_guilloche"),
    ("case_high_tier_legacy", "LEGACY", "High Tier", "#d97706", "heritage_shield"),
    ("case_high_tier_the_archive", "THE ARCHIVE", "High Tier", "#0284c7", "quantum_core"),
    ("case_high_tier_last_chance", "LAST CHANCE", "High Tier", "#dc2626", "zero_hour_clock"),
    ("case_high_tier_caser_001", "CASER.001", "High Tier", "#D7FF64", "genesis_chip"),
]

# Fix bloodline color if needed
CASES[12] = ("case_standard_bloodline", "BLOODLINE", "Standard", "#b91c1c", "helix_ribbon")

def get_symbol_svg(motif, color):
    c = color
    if motif == "dagger_slash":
        return f'''
        <path d="M140 300 L250 110 L260 120 L160 310 Z" fill="{c}" opacity="0.9"/>
        <path d="M125 315 L145 295 L165 315 L145 335 Z" fill="{c}"/>
        <line x1="120" y1="180" x2="280" y2="220" stroke="{c}" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.6"/>
        <polygon points="250,110 270,90 280,100 260,120" fill="#fff" opacity="0.8"/>
        '''
    elif motif == "schematic_grid":
        return f'''
        <rect x="130" y="130" width="140" height="140" fill="none" stroke="{c}" stroke-width="1.5" opacity="0.4"/>
        <line x1="130" y1="200" x2="270" y2="200" stroke="{c}" stroke-width="1" opacity="0.3"/>
        <line x1="200" y1="130" x2="200" y2="270" stroke="{c}" stroke-width="1" opacity="0.3"/>
        <polygon points="200,140 260,200 200,260 140,200" fill="none" stroke="{c}" stroke-width="2"/>
        <circle cx="200" cy="200" r="16" fill="{c}" opacity="0.2"/>
        <circle cx="200" cy="200" r="4" fill="{c}"/>
        '''
    elif motif == "wireframe_cube":
        return f'''
        <polygon points="200,120 260,155 200,190 140,155" fill="{c}" opacity="0.15" stroke="{c}" stroke-width="1.5"/>
        <polygon points="140,155 200,190 200,260 140,225" fill="{c}" opacity="0.25" stroke="{c}" stroke-width="1.5"/>
        <polygon points="260,155 200,190 200,260 260,225" fill="{c}" opacity="0.35" stroke="{c}" stroke-width="1.5"/>
        <circle cx="200" cy="190" r="5" fill="#fff"/>
        '''
    elif motif == "pixel_diamond":
        return f'''
        <rect x="190" y="130" width="20" height="20" fill="{c}"/>
        <rect x="170" y="150" width="20" height="20" fill="{c}" opacity="0.8"/>
        <rect x="210" y="150" width="20" height="20" fill="{c}" opacity="0.8"/>
        <rect x="150" y="170" width="20" height="20" fill="{c}" opacity="0.6"/>
        <rect x="190" y="170" width="20" height="20" fill="#fff"/>
        <rect x="230" y="170" width="20" height="20" fill="{c}" opacity="0.6"/>
        <rect x="170" y="190" width="20" height="20" fill="{c}" opacity="0.8"/>
        <rect x="210" y="190" width="20" height="20" fill="{c}" opacity="0.8"/>
        <rect x="190" y="210" width="20" height="20" fill="{c}"/>
        <rect x="190" y="230" width="20" height="20" fill="{c}" opacity="0.4"/>
        '''
    elif motif == "ice_crystal":
        return f'''
        <polygon points="200,110 220,170 200,290 180,170" fill="{c}" opacity="0.8"/>
        <polygon points="110,200 170,180 290,200 170,220" fill="{c}" opacity="0.6"/>
        <polygon points="140,140 180,180 140,260 160,200" fill="#fff" opacity="0.4"/>
        <polygon points="260,140 220,180 260,260 240,200" fill="#fff" opacity="0.5"/>
        <circle cx="200" cy="200" r="10" fill="#fff"/>
        '''
    elif motif == "racing_stripes":
        return f'''
        <line x1="160" y1="110" x2="160" y2="290" stroke="{c}" stroke-width="14"/>
        <line x1="184" y1="110" x2="184" y2="290" stroke="{c}" stroke-width="4"/>
        <line x1="220" y1="110" x2="220" y2="290" stroke="#fff" stroke-width="2" opacity="0.5"/>
        <rect x="130" y="180" width="140" height="40" fill="#151515" stroke="{c}" stroke-width="1"/>
        <text x="200" y="205" fill="#fff" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle" letter-spacing="3">REDLINE</text>
        '''
    elif motif == "synth_triangle":
        return f'''
        <polygon points="200,120 270,260 130,260" fill="none" stroke="{c}" stroke-width="3"/>
        <polygon points="200,145 250,245 150,245" fill="none" stroke="{c}" stroke-width="1" opacity="0.5"/>
        <circle cx="200" cy="210" r="25" fill="{c}" opacity="0.3"/>
        <circle cx="200" cy="210" r="6" fill="#fff"/>
        '''
    elif motif == "biohazard_tri":
        return f'''
        <circle cx="200" cy="180" r="28" fill="none" stroke="{c}" stroke-width="4"/>
        <circle cx="175" cy="225" r="28" fill="none" stroke="{c}" stroke-width="4"/>
        <circle cx="225" cy="225" r="28" fill="none" stroke="{c}" stroke-width="4"/>
        <circle cx="200" cy="210" r="12" fill="#080808" stroke="{c}" stroke-width="3"/>
        <circle cx="200" cy="210" r="4" fill="{c}"/>
        '''
    elif motif == "glitch_bars":
        return f'''
        <rect x="130" y="140" width="120" height="12" fill="{c}"/>
        <rect x="160" y="160" width="110" height="8" fill="#fff" opacity="0.8"/>
        <rect x="120" y="176" width="160" height="24" fill="{c}" opacity="0.7"/>
        <rect x="140" y="208" width="90" height="10" fill="#fff" opacity="0.9"/>
        <rect x="180" y="226" width="90" height="16" fill="{c}"/>
        <line x1="110" y1="200" x2="290" y2="200" stroke="#fff" stroke-width="1" stroke-dasharray="2 4"/>
        '''
    elif motif == "crescent_sphere":
        return f'''
        <circle cx="200" cy="200" r="60" fill="#151515" stroke="{c}" stroke-width="2"/>
        <path d="M200 140 A60 60 0 0 1 200 260 A42 60 0 0 0 200 140" fill="{c}"/>
        <circle cx="200" cy="200" r="74" fill="none" stroke="{c}" stroke-width="1" stroke-dasharray="6 6" opacity="0.4"/>
        '''
    elif motif == "angular_glacier":
        return f'''
        <polygon points="200,120 250,220 200,270 150,220" fill="none" stroke="{c}" stroke-width="2"/>
        <line x1="200" y1="120" x2="200" y2="270" stroke="{c}" stroke-width="1.5"/>
        <line x1="150" y1="220" x2="250" y2="220" stroke="{c}" stroke-width="1.5"/>
        <polygon points="200,160 225,220 200,245 175,220" fill="{c}" opacity="0.3"/>
        '''
    elif motif == "hazard_chevrons":
        return f'''
        <path d="M150 140 L200 180 L250 140" fill="none" stroke="{c}" stroke-width="6"/>
        <path d="M150 180 L200 220 L250 180" fill="none" stroke="{c}" stroke-width="6"/>
        <path d="M150 220 L200 260 L250 220" fill="none" stroke="{c}" stroke-width="6"/>
        <circle cx="200" cy="130" r="4" fill="{c}"/>
        '''
    elif motif == "helix_ribbon":
        return f'''
        <path d="M160 120 Q200 170 240 120 Q200 220 160 220 Q200 270 240 280" fill="none" stroke="{c}" stroke-width="4"/>
        <path d="M240 120 Q200 170 160 120 Q200 220 240 220 Q200 270 160 280" fill="none" stroke="#fff" stroke-width="2" opacity="0.7"/>
        <circle cx="200" cy="170" r="5" fill="{c}"/>
        <circle cx="200" cy="220" r="5" fill="{c}"/>
        '''
    elif motif == "cyber_aperture":
        return f'''
        <polygon points="200,130 255,165 255,235 200,270 145,235 145,165" fill="none" stroke="{c}" stroke-width="2"/>
        <circle cx="200" cy="200" r="35" fill="none" stroke="{c}" stroke-width="2" stroke-dasharray="8 4"/>
        <circle cx="200" cy="200" r="14" fill="{c}" opacity="0.4"/>
        <circle cx="200" cy="200" r="5" fill="#fff"/>
        <line x1="200" y1="110" x2="200" y2="130" stroke="{c}" stroke-width="2"/>
        <line x1="200" y1="270" x2="200" y2="290" stroke="{c}" stroke-width="2"/>
        '''
    elif motif == "event_horizon":
        return f'''
        <circle cx="200" cy="200" r="45" fill="#080808" stroke="{c}" stroke-width="3"/>
        <ellipse cx="200" cy="200" rx="75" ry="24" fill="none" stroke="{c}" stroke-width="2" transform="rotate(-25 200 200)"/>
        <circle cx="200" cy="200" r="18" fill="{c}" opacity="0.2"/>
        <circle cx="200" cy="200" r="3" fill="#fff"/>
        '''
    elif motif == "viper_fangs":
        return f'''
        <path d="M165 140 Q175 220 155 260 Q185 230 185 140 Z" fill="{c}"/>
        <path d="M235 140 Q225 220 245 260 Q215 230 215 140 Z" fill="{c}"/>
        <circle cx="200" cy="160" r="6" fill="#fff"/>
        '''
    elif motif == "warp_singularity":
        return f'''
        <line x1="200" y1="110" x2="200" y2="290" stroke="{c}" stroke-width="1" opacity="0.4"/>
        <line x1="110" y1="200" x2="290" y2="200" stroke="{c}" stroke-width="1" opacity="0.4"/>
        <line x1="135" y1="135" x2="265" y2="265" stroke="{c}" stroke-width="1" opacity="0.4"/>
        <line x1="135" y1="265" x2="265" y2="135" stroke="{c}" stroke-width="1" opacity="0.4"/>
        <circle cx="200" cy="200" r="50" fill="none" stroke="{c}" stroke-width="2"/>
        <circle cx="200" cy="200" r="28" fill="none" stroke="{c}" stroke-width="1.5"/>
        <circle cx="200" cy="200" r="8" fill="#fff"/>
        '''
    elif motif == "gold_faceted_box":
        return f'''
        <polygon points="200,120 260,160 200,200 140,160" fill="{c}" opacity="0.7"/>
        <polygon points="140,160 200,200 200,270 140,230" fill="{c}" opacity="0.5"/>
        <polygon points="260,160 200,200 200,270 260,230" fill="{c}" opacity="0.9"/>
        <line x1="200" y1="120" x2="200" y2="270" stroke="#fff" stroke-width="1" opacity="0.6"/>
        '''
    elif motif == "stealth_facet":
        return f'''
        <polygon points="200,110 270,270 200,240 130,270" fill="#1c1c1c" stroke="{c}" stroke-width="2"/>
        <polygon points="200,110 270,270 200,240" fill="{c}" opacity="0.2"/>
        <line x1="200" y1="110" x2="200" y2="240" stroke="{c}" stroke-width="1.5"/>
        <circle cx="200" cy="180" r="4" fill="#fff"/>
        '''
    elif motif == "lunar_eclipse":
        return f'''
        <circle cx="200" cy="200" r="55" fill="{c}" opacity="0.9"/>
        <circle cx="220" cy="190" r="52" fill="#080808"/>
        <circle cx="200" cy="200" r="68" fill="none" stroke="{c}" stroke-width="1" stroke-dasharray="3 6" opacity="0.5"/>
        '''
    elif motif == "combustion_arc":
        return f'''
        <path d="M140 240 A70 70 0 1 1 260 240" fill="none" stroke="{c}" stroke-width="8" stroke-linecap="round"/>
        <line x1="200" y1="200" x2="240" y2="160" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
        <circle cx="200" cy="200" r="8" fill="#fff"/>
        <circle cx="200" cy="200" r="2" fill="{c}"/>
        '''
    elif motif == "ruby_cluster":
        return f'''
        <polygon points="200,120 245,155 230,235 200,270 170,235 155,155" fill="{c}" opacity="0.8"/>
        <polygon points="200,120 245,155 200,175 155,155" fill="#fff" opacity="0.3"/>
        <polygon points="200,175 230,235 200,270 170,235" fill="#000" opacity="0.2"/>
        <circle cx="200" cy="175" r="4" fill="#fff"/>
        '''
    elif motif == "monolithic_shard":
        return f'''
        <polygon points="190,110 215,110 225,290 175,290" fill="#fff" opacity="0.9"/>
        <line x1="202" y1="110" x2="202" y2="290" stroke="#151515" stroke-width="1"/>
        <rect x="140" y="195" width="120" height="10" fill="{c}" opacity="0.4"/>
        '''
    elif motif == "matte_seal":
        return f'''
        <rect x="135" y="135" width="130" height="130" rx="8" fill="#151515" stroke="{c}" stroke-width="2"/>
        <rect x="150" y="150" width="100" height="100" rx="4" fill="none" stroke="{c}" stroke-width="1" stroke-dasharray="4 4"/>
        <text x="200" y="206" fill="#fff" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle" letter-spacing="4">BLACK</text>
        <text x="200" y="224" fill="{c}" font-family="monospace" font-size="9" text-anchor="middle" letter-spacing="2">EDITION</text>
        '''
    elif motif == "sovereign_crown":
        return f'''
        <polygon points="140,240 140,170 170,200 200,140 230,200 260,170 260,240" fill="{c}" opacity="0.85"/>
        <circle cx="140" cy="165" r="5" fill="#fff"/>
        <circle cx="200" cy="135" r="6" fill="#fff"/>
        <circle cx="260" cy="165" r="5" fill="#fff"/>
        <rect x="140" y="245" width="120" height="10" fill="{c}"/>
        '''
    elif motif == "brilliant_diamond":
        return f'''
        <polygon points="150,165 250,165 280,200 200,280 120,200" fill="none" stroke="{c}" stroke-width="2"/>
        <line x1="150" y1="165" x2="200" y2="280" stroke="{c}" stroke-width="1"/>
        <line x1="250" y1="165" x2="200" y2="280" stroke="{c}" stroke-width="1"/>
        <line x1="120" y1="200" x2="280" y2="200" stroke="{c}" stroke-width="1.5"/>
        <polygon points="175,165 225,165 240,200 200,280 160,200" fill="{c}" opacity="0.25"/>
        <circle cx="200" cy="165" r="3" fill="#fff"/>
        '''
    elif motif == "vitreous_glass":
        return f'''
        <polygon points="170,120 250,140 230,240 150,260 130,170" fill="#1c1c24" stroke="{c}" stroke-width="2"/>
        <line x1="170" y1="120" x2="230" y2="240" stroke="{c}" stroke-width="1"/>
        <line x1="250" y1="140" x2="150" y2="260" stroke="#fff" stroke-width="1" opacity="0.6"/>
        <polygon points="170,120 205,185 130,170" fill="{c}" opacity="0.3"/>
        '''
    elif motif == "sunburst_wreath":
        return f'''
        <circle cx="200" cy="200" r="32" fill="{c}" opacity="0.85"/>
        <circle cx="200" cy="200" r="54" fill="none" stroke="{c}" stroke-width="1.5" stroke-dasharray="4 6"/>
        <circle cx="200" cy="200" r="16" fill="#080808"/>
        <circle cx="200" cy="200" r="4" fill="#fff"/>
        '''
    elif motif == "constellation_orbits":
        return f'''
        <circle cx="200" cy="200" r="10" fill="{c}"/>
        <ellipse cx="200" cy="200" rx="70" ry="25" fill="none" stroke="{c}" stroke-width="1.5" transform="rotate(30 200 200)"/>
        <ellipse cx="200" cy="200" rx="70" ry="25" fill="none" stroke="{c}" stroke-width="1.5" transform="rotate(-30 200 200)"/>
        <circle cx="150" cy="170" r="4" fill="#fff"/>
        <circle cx="245" cy="225" r="5" fill="#fff"/>
        '''
    elif motif == "bullion_isometric":
        return f'''
        <polygon points="160,160 220,135 250,150 190,175" fill="{c}" opacity="0.9"/>
        <polygon points="160,160 190,175 190,205 160,190" fill="{c}" opacity="0.6"/>
        <polygon points="190,175 250,150 250,180 190,205" fill="{c}" opacity="0.8"/>
        <polygon points="140,200 200,175 230,190 170,215" fill="{c}" opacity="0.8"/>
        <polygon points="140,200 170,215 170,245 140,230" fill="{c}" opacity="0.5"/>
        <polygon points="170,215 230,190 230,220 170,245" fill="{c}" opacity="0.7"/>
        <text x="205" y="157" fill="#080808" font-family="monospace" font-size="8" font-weight="bold" transform="rotate(-22 205 157)">999.9</text>
        '''
    elif motif == "sacred_circles":
        return f'''
        <circle cx="200" cy="200" r="45" fill="none" stroke="{c}" stroke-width="1.5"/>
        <circle cx="200" cy="155" r="45" fill="none" stroke="{c}" stroke-width="1" opacity="0.6"/>
        <circle cx="200" cy="245" r="45" fill="none" stroke="{c}" stroke-width="1" opacity="0.6"/>
        <circle cx="160" cy="180" r="45" fill="none" stroke="{c}" stroke-width="1" opacity="0.6"/>
        <circle cx="240" cy="180" r="45" fill="none" stroke="{c}" stroke-width="1" opacity="0.6"/>
        <circle cx="200" cy="200" r="6" fill="#fff"/>
        '''
    elif motif == "flame_vector":
        return f'''
        <path d="M200 110 Q240 180 230 220 Q220 260 200 270 Q180 260 170 220 Q160 180 200 110 Z" fill="{c}" opacity="0.85"/>
        <path d="M200 160 Q220 200 215 230 Q208 255 200 260 Q192 255 185 230 Q180 200 200 160 Z" fill="#fff" opacity="0.9"/>
        <circle cx="200" cy="235" r="5" fill="{c}"/>
        '''
    elif motif == "platinum_scepter":
        return f'''
        <line x1="200" y1="140" x2="200" y2="280" stroke="{c}" stroke-width="4"/>
        <circle cx="200" cy="140" r="24" fill="{c}" opacity="0.4"/>
        <polygon points="200,115 210,135 230,140 210,145 200,165 190,145 170,140 190,135" fill="#fff"/>
        <circle cx="200" cy="280" r="8" fill="{c}"/>
        '''
    elif motif == "corona_halo":
        return f'''
        <circle cx="200" cy="200" r="55" fill="none" stroke="{c}" stroke-width="6" opacity="0.6"/>
        <circle cx="200" cy="200" r="48" fill="#080808"/>
        <circle cx="200" cy="200" r="42" fill="{c}" opacity="0.1"/>
        <circle cx="200" cy="200" r="70" fill="none" stroke="{c}" stroke-width="1" stroke-dasharray="2 6"/>
        '''
    elif motif == "tactical_blade":
        return f'''
        <path d="M150 250 L200 120 L220 125 L210 200 L230 250 Z" fill="{c}" opacity="0.85"/>
        <line x1="170" y1="210" x2="230" y2="210" stroke="#fff" stroke-width="2"/>
        <circle cx="200" cy="160" r="3" fill="#fff"/>
        '''
    elif motif == "balisong_profile":
        return f'''
        <path d="M190 280 L195 190 L185 130 L195 125 L205 190 L200 280" fill="{c}" opacity="0.8"/>
        <path d="M175 280 L180 200" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
        <path d="M215 280 L210 200" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
        <circle cx="195" cy="195" r="4" fill="#fff"/>
        '''
    elif motif == "curved_claw":
        return f'''
        <path d="M160 260 Q150 160 230 130 Q210 180 235 220 Q180 210 160 260 Z" fill="{c}" opacity="0.9"/>
        <circle cx="160" cy="260" r="16" fill="none" stroke="#fff" stroke-width="3"/>
        <circle cx="160" cy="260" r="6" fill="{c}"/>
        '''
    elif motif == "gauntlet_mesh":
        return f'''
        <rect x="150" y="140" width="100" height="120" rx="12" fill="none" stroke="{c}" stroke-width="2"/>
        <line x1="150" y1="180" x2="250" y2="180" stroke="{c}" stroke-width="1.5"/>
        <line x1="150" y1="220" x2="250" y2="220" stroke="{c}" stroke-width="1.5"/>
        <circle cx="175" cy="160" r="6" fill="{c}"/>
        <circle cx="200" cy="160" r="6" fill="{c}"/>
        <circle cx="225" cy="160" r="6" fill="{c}"/>
        '''
    elif motif == "sniper_reticle":
        return f'''
        <circle cx="200" cy="200" r="60" fill="none" stroke="{c}" stroke-width="2"/>
        <line x1="120" y1="200" x2="280" y2="200" stroke="{c}" stroke-width="1.5"/>
        <line x1="200" y1="120" x2="200" y2="280" stroke="{c}" stroke-width="1.5"/>
        <circle cx="200" cy="200" r="3" fill="#fff"/>
        <circle cx="200" cy="200" r="25" fill="none" stroke="{c}" stroke-width="1" stroke-dasharray="3 3"/>
        '''
    elif motif == "rifle_profile":
        return f'''
        <path d="M130 195 L270 195 L270 205 L220 205 L210 235 L195 235 L200 205 L130 205 Z" fill="{c}"/>
        <rect x="140" y="188" width="50" height="7" fill="#fff" opacity="0.6"/>
        <circle cx="250" cy="200" r="3" fill="#fff"/>
        '''
    elif motif == "heavy_slide":
        return f'''
        <rect x="135" y="175" width="130" height="40" rx="4" fill="{c}" opacity="0.9"/>
        <rect x="135" y="215" width="40" height="50" rx="3" fill="{c}" opacity="0.7"/>
        <line x1="155" y1="185" x2="185" y2="185" stroke="#fff" stroke-width="2"/>
        <line x1="155" y1="192" x2="185" y2="192" stroke="#fff" stroke-width="2"/>
        <circle cx="255" cy="185" r="4" fill="#fff"/>
        '''
    elif motif == "crimson_prism":
        return f'''
        <polygon points="200,125 265,245 135,245" fill="{c}" opacity="0.8"/>
        <polygon points="200,165 240,235 160,235" fill="#fff" opacity="0.4"/>
        <circle cx="200" cy="200" r="5" fill="#fff"/>
        '''
    elif motif == "violet_spectrograph":
        return f'''
        <line x1="140" y1="200" x2="140" y2="230" stroke="{c}" stroke-width="5" stroke-linecap="round"/>
        <line x1="160" y1="170" x2="160" y2="250" stroke="{c}" stroke-width="5" stroke-linecap="round"/>
        <line x1="180" y1="140" x2="180" y2="260" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
        <line x1="200" y1="120" x2="200" y2="280" stroke="{c}" stroke-width="5" stroke-linecap="round"/>
        <line x1="220" y1="140" x2="220" y2="260" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
        <line x1="240" y1="170" x2="240" y2="250" stroke="{c}" stroke-width="5" stroke-linecap="round"/>
        <line x1="260" y1="200" x2="260" y2="230" stroke="{c}" stroke-width="5" stroke-linecap="round"/>
        '''
    elif motif == "gold_fingerprint":
        return f'''
        <path d="M200 150 A50 50 0 0 1 200 250" fill="none" stroke="{c}" stroke-width="3" stroke-linecap="round"/>
        <path d="M200 165 A35 35 0 0 1 200 235" fill="none" stroke="{c}" stroke-width="3" stroke-linecap="round"/>
        <path d="M200 180 A20 20 0 0 1 200 220" fill="none" stroke="{c}" stroke-width="3" stroke-linecap="round"/>
        <circle cx="200" cy="200" r="4" fill="#fff"/>
        '''
    elif motif == "stealth_monolith":
        return f'''
        <rect x="155" y="130" width="90" height="140" rx="4" fill="#151515" stroke="{c}" stroke-width="1.5"/>
        <line x1="155" y1="200" x2="245" y2="200" stroke="{c}" stroke-width="0.75" stroke-dasharray="2 4"/>
        <circle cx="200" cy="250" r="3.5" fill="{c}"/>
        '''
    elif motif == "vault_guilloche":
        return f'''
        <circle cx="200" cy="200" r="62" fill="none" stroke="{c}" stroke-width="3"/>
        <circle cx="200" cy="200" r="50" fill="none" stroke="{c}" stroke-width="1" stroke-dasharray="4 4"/>
        <circle cx="200" cy="200" r="28" fill="#151515" stroke="{c}" stroke-width="2"/>
        <rect x="198" y="145" width="4" height="14" fill="#fff"/>
        <circle cx="200" cy="200" r="5" fill="{c}"/>
        '''
    elif motif == "heritage_shield":
        return f'''
        <path d="M150 135 L250 135 L250 205 Q250 265 200 280 Q150 265 150 205 Z" fill="#151515" stroke="{c}" stroke-width="2"/>
        <path d="M165 150 L235 150 L235 200 Q235 245 200 260 Q165 245 165 200 Z" fill="{c}" opacity="0.3"/>
        <text x="200" y="215" fill="#fff" font-family="serif" font-size="28" font-weight="bold" text-anchor="middle">C</text>
        '''
    elif motif == "quantum_core":
        return f'''
        <rect x="140" y="140" width="120" height="120" rx="8" fill="#0d0f13" stroke="{c}" stroke-width="2"/>
        <circle cx="200" cy="200" r="32" fill="{c}" opacity="0.2" stroke="{c}" stroke-width="1.5"/>
        <circle cx="200" cy="200" r="8" fill="#fff"/>
        <line x1="200" y1="125" x2="200" y2="140" stroke="{c}" stroke-width="2"/>
        <line x1="200" y1="260" x2="200" y2="275" stroke="{c}" stroke-width="2"/>
        <line x1="125" y1="200" x2="140" y2="200" stroke="{c}" stroke-width="2"/>
        <line x1="260" y1="200" x2="275" y2="200" stroke="{c}" stroke-width="2"/>
        '''
    elif motif == "zero_hour_clock":
        return f'''
        <circle cx="200" cy="200" r="60" fill="none" stroke="{c}" stroke-width="3"/>
        <path d="M200 200 L200 145 A55 55 0 0 1 245 175 Z" fill="{c}" opacity="0.8"/>
        <circle cx="200" cy="200" r="5" fill="#fff"/>
        <circle cx="200" cy="145" r="2" fill="#fff"/>
        <circle cx="255" cy="200" r="2" fill="#fff"/>
        '''
    elif motif == "genesis_chip":
        return f'''
        <rect x="145" y="145" width="110" height="110" rx="6" fill="#12151a" stroke="{c}" stroke-width="2"/>
        <rect x="170" y="170" width="60" height="60" rx="3" fill="{c}" opacity="0.25" stroke="{c}" stroke-width="1"/>
        <circle cx="200" cy="200" r="6" fill="#D7FF64"/>
        <line x1="130" y1="170" x2="145" y2="170" stroke="{c}" stroke-width="2"/>
        <line x1="130" y1="200" x2="145" y2="200" stroke="{c}" stroke-width="2"/>
        <line x1="130" y1="230" x2="145" y2="230" stroke="{c}" stroke-width="2"/>
        <line x1="255" y1="170" x2="270" y2="170" stroke="{c}" stroke-width="2"/>
        <line x1="255" y1="200" x2="270" y2="200" stroke="{c}" stroke-width="2"/>
        <line x1="255" y1="230" x2="270" y2="230" stroke="{c}" stroke-width="2"/>
        '''
    else:
        return f'''
        <polygon points="200,130 260,240 140,240" fill="none" stroke="{c}" stroke-width="2"/>
        <circle cx="200" cy="200" r="20" fill="{c}" opacity="0.3"/>
        <circle cx="200" cy="200" r="4" fill="#fff"/>
        '''

def generate_svg(case_id, name, category, color, motif):
    symbol_markup = get_symbol_svg(motif, color)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGlow_{case_id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="{color}" stop-opacity="0.12"/>
      <stop offset="70%" stop-color="#080808" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="frameGrad_{case_id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.12)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.02)"/>
    </linearGradient>
  </defs>

  <!-- Deep Dark Minimal Canvas -->
  <rect width="400" height="400" fill="#080808"/>
  <rect width="400" height="400" fill="url(#bgGlow_{case_id})"/>

  <!-- Subtle Precision Grid Lines -->
  <line x1="40" y1="200" x2="360" y2="200" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
  <line x1="200" y1="40" x2="200" y2="360" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
  <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
  <circle cx="200" cy="200" r="170" fill="none" stroke="rgba(255,255,255,0.02)" stroke-width="1" stroke-dasharray="2 6"/>

  <!-- Border Card Frame -->
  <rect x="24" y="24" width="352" height="352" rx="12" fill="none" stroke="url(#frameGrad_{case_id})" stroke-width="1"/>

  <!-- Top Metadata Header -->
  <text x="44" y="54" fill="#555555" font-family="'JetBrains Mono', monospace" font-size="9" letter-spacing="2">CASER.GG // ORIGINALS</text>
  <text x="356" y="54" fill="{color}" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="600" text-anchor="end" letter-spacing="1">{category.upper()}</text>

  <!-- Central Editorial Motif -->
  <g id="motif">
    {symbol_markup}
  </g>

  <!-- Bottom Title Label -->
  <text x="200" y="328" fill="#F5F5F5" font-family="'Inter', sans-serif" font-size="14" font-weight="700" text-anchor="middle" letter-spacing="3">{name}</text>
  <text x="200" y="348" fill="#555555" font-family="'JetBrains Mono', monospace" font-size="9" text-anchor="middle" letter-spacing="1">SERIES 2026 // CASE ID #{case_id[-3:]}</text>

  <!-- Corner Accents -->
  <line x1="24" y1="36" x2="36" y2="24" stroke="{color}" stroke-width="1.5"/>
  <line x1="376" y1="364" x2="364" y2="376" stroke="{color}" stroke-width="1.5"/>
</svg>'''
    return svg

count = 0
for cid, name, cat, color, motif in CASES:
    filepath = os.path.join(out_dir, f"{cid}.svg")
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(generate_svg(cid, name, cat, color, motif))
    count += 1

print(f"Successfully generated {count} custom SVG case covers in {out_dir}")
