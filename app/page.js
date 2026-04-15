"use client";

import React, { useMemo, useState } from "react";

const theme = {
  bg: "#090909",
  bgSoft: "#0f0f10",
  card: "#141414",
  cardAlt: "#1a1a1b",
  border: "#27272a",
  accent: "#c9a35c",
  accentSoft: "rgba(201,163,92,0.14)",
  text: "#f8f8f8",
  subtext: "#a1a1aa",
  headingFont: "'Playfair Display', Georgia, serif",
  bodyFont: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

function round1(num) {
  return Math.round(num * 10) / 10;
}

function addMacros(parts) {
  return parts.reduce(
    (acc, part) => ({
      calories: round1(acc.calories + part.calories),
      protein: round1(acc.protein + part.protein),
      carbs: round1(acc.carbs + part.carbs),
      fat: round1(acc.fat + part.fat),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

function calcMacros(item, grams) {
  if (!item || grams <= 0) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const factor = grams / 100;
  return {
    calories: round1(item.macrosPer100.calories * factor),
    protein: round1(item.macrosPer100.protein * factor),
    carbs: round1(item.macrosPer100.carbs * factor),
    fat: round1(item.macrosPer100.fat * factor),
  };
}

function gramsToOunces(grams) {
  return round1(grams / 28.3495);
}

const savoryProteins = [
  { name: "Chicken Breast", unit: "g", macrosPer100: { calories: 165, protein: 31, carbs: 0, fat: 3.6 }, grams: { lean: 150, anabolic: 200, bulk: 180, low_cal: 130 } },
  { name: "Lean Ground Beef 90/10", unit: "g", macrosPer100: { calories: 176, protein: 26, carbs: 0, fat: 10 }, grams: { lean: 150, anabolic: 140, bulk: 180, low_cal: 120 } },
  { name: "Salmon", unit: "g", macrosPer100: { calories: 208, protein: 20, carbs: 0, fat: 13 }, grams: { lean: 150, anabolic: 150, bulk: 180, low_cal: 120 } },
  { name: "Turkey Breast Deli", unit: "g", macrosPer100: { calories: 104, protein: 17, carbs: 3, fat: 2 }, grams: { lean: 120, anabolic: 150, bulk: 140, low_cal: 100 } },
  { name: "Egg Whites", unit: "g", macrosPer100: { calories: 52, protein: 11, carbs: 1, fat: 0.2 }, grams: { lean: 220, anabolic: 280, bulk: 220, low_cal: 200 } },
];

const savoryCarbs = [
  { name: "Rice Cooked", unit: "g", macrosPer100: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 }, grams: { lean: 150, anabolic: 120, bulk: 220, low_cal: 100 } },
  { name: "Potato", unit: "g", macrosPer100: { calories: 87, protein: 1.9, carbs: 20, fat: 0.1 }, grams: { lean: 200, anabolic: 150, bulk: 280, low_cal: 120 } },
  { name: "Sweet Potato", unit: "g", macrosPer100: { calories: 86, protein: 1.6, carbs: 20, fat: 0.1 }, grams: { lean: 180, anabolic: 150, bulk: 250, low_cal: 120 } },
  { name: "Bread", unit: "g", macrosPer100: { calories: 265, protein: 9, carbs: 49, fat: 3.2 }, grams: { lean: 60, anabolic: 60, bulk: 100, low_cal: 50 } },
  { name: "Bagel", unit: "g", macrosPer100: { calories: 250, protein: 10, carbs: 49, fat: 1.5 }, grams: { lean: 75, anabolic: 75, bulk: 110, low_cal: 55 } },
];

const savoryFats = [
  { name: "None", unit: "g", macrosPer100: { calories: 0, protein: 0, carbs: 0, fat: 0 }, grams: { lean: 0, anabolic: 0, bulk: 0, low_cal: 0 } },
  { name: "Olive Oil", unit: "g", macrosPer100: { calories: 884, protein: 0, carbs: 0, fat: 100 }, grams: { lean: 5, anabolic: 5, bulk: 15, low_cal: 0 } },
  { name: "Avocado", unit: "g", macrosPer100: { calories: 160, protein: 2, carbs: 9, fat: 15 }, grams: { lean: 40, anabolic: 35, bulk: 70, low_cal: 25 } },
  { name: "Peanut Butter", unit: "g", macrosPer100: { calories: 588, protein: 25, carbs: 20, fat: 50 }, grams: { lean: 12, anabolic: 10, bulk: 24, low_cal: 8 } },
];

const savoryVeg = [
  { name: "Broccoli", unit: "g", macrosPer100: { calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4 }, grams: { lean: 120, anabolic: 150, bulk: 100, low_cal: 180 } },
  { name: "Green Beans", unit: "g", macrosPer100: { calories: 31, protein: 1.8, carbs: 7, fat: 0.1 }, grams: { lean: 120, anabolic: 150, bulk: 100, low_cal: 180 } },
  { name: "Asparagus", unit: "g", macrosPer100: { calories: 20, protein: 2.2, carbs: 3.9, fat: 0.1 }, grams: { lean: 120, anabolic: 150, bulk: 100, low_cal: 180 } },
  { name: "Spinach", unit: "g", macrosPer100: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 }, grams: { lean: 80, anabolic: 100, bulk: 60, low_cal: 120 } },
];

const dessertBases = [
  { name: "Greek Yogurt Nonfat", unit: "g", macrosPer100: { calories: 59, protein: 10, carbs: 3.6, fat: 0.4 }, grams: { lean: 200, anabolic: 250, bulk: 220, low_cal: 170 } },
  { name: "Cottage Cheese Low-Fat", unit: "g", macrosPer100: { calories: 81, protein: 10.5, carbs: 4, fat: 2.3 }, grams: { lean: 180, anabolic: 220, bulk: 200, low_cal: 150 } },
  { name: "Whey Isolate", unit: "g", macrosPer100: { calories: 372, protein: 86, carbs: 4, fat: 2 }, grams: { lean: 30, anabolic: 40, bulk: 35, low_cal: 25 } },
  { name: "Egg Whites", unit: "g", macrosPer100: { calories: 52, protein: 11, carbs: 1, fat: 0.2 }, grams: { lean: 180, anabolic: 240, bulk: 200, low_cal: 150 } },
];

const dessertCarbs = [
  { name: "Oats Dry", unit: "g", macrosPer100: { calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9 }, grams: { lean: 40, anabolic: 40, bulk: 70, low_cal: 25 } },
  { name: "Cream of Rice Dry", unit: "g", macrosPer100: { calories: 370, protein: 6.7, carbs: 83, fat: 0.6 }, grams: { lean: 40, anabolic: 45, bulk: 70, low_cal: 25 } },
  { name: "Banana", unit: "g", macrosPer100: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3 }, grams: { lean: 100, anabolic: 100, bulk: 140, low_cal: 60 } },
  { name: "Blueberries", unit: "g", macrosPer100: { calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3 }, grams: { lean: 80, anabolic: 80, bulk: 120, low_cal: 60 } },
];

const dessertAddons = [
  { name: "None", unit: "g", macrosPer100: { calories: 0, protein: 0, carbs: 0, fat: 0 }, grams: { lean: 0, anabolic: 0, bulk: 0, low_cal: 0 } },
  { name: "Peanut Butter", unit: "g", macrosPer100: { calories: 588, protein: 25, carbs: 20, fat: 50 }, grams: { lean: 12, anabolic: 10, bulk: 24, low_cal: 8 } },
  { name: "Almonds", unit: "g", macrosPer100: { calories: 579, protein: 21, carbs: 22, fat: 50 }, grams: { lean: 15, anabolic: 15, bulk: 28, low_cal: 10 } },
];

const dessertStyles = [
  "Ice Cream",
  "Cheesecake Bowl",
  "Pudding",
  "Mug Cake",
  "Cookie Dough",
];

function SelectField({ label, value, onChange, options }) {
  return (
    <label style={{ display: "grid", gap: 8, minWidth: 0 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: theme.subtext, textTransform: "uppercase", letterSpacing: "0.12em" }}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={selectStyle}>
        {options.map((option) => {
          const v = typeof option === "string" ? option : option.value;
          const l = typeof option === "string" ? option : option.label;
          return (
            <option key={v} value={v}>
              {l}
            </option>
          );
        })}
      </select>
    </label>
  );
}

function NumberField({ label, value, onChange, helper }) {
  return (
    <label style={{ display: "grid", gap: 8, minWidth: 0 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: theme.subtext, textTransform: "uppercase", letterSpacing: "0.12em" }}>{label}</span>
      <input type="number" min={0} step={1} value={value} onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))} style={selectStyle} />
      {helper ? <span style={{ color: theme.subtext, fontSize: 12 }}>{helper}</span> : null}
    </label>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{ background: theme.bgSoft, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 16, minWidth: 0 }}>
      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.18em", color: theme.accent, fontWeight: 700 }}>{label}</div>
      <div style={{ marginTop: 10, fontSize: 28, fontWeight: 700, color: theme.text }}>{value}</div>
    </div>
  );
}

function Tag({ children }) {
  return (
    <span style={{ padding: "10px 14px", borderRadius: 999, border: `1px solid rgba(201,163,92,0.24)`, background: theme.accentSoft, color: theme.text, fontSize: 13, fontWeight: 700 }}>
      {children}
    </span>
  );
}

function tabButtonStyle(isActive) {
  return {
    minHeight: 40,
    borderRadius: 16,
    border: `1px solid ${isActive ? "rgba(201,163,92,0.32)" : theme.border}`,
    background: isActive ? theme.accentSoft : theme.bgSoft,
    color: theme.text,
    padding: "8px 14px",
    fontWeight: 700,
    cursor: "pointer",
  };
}

function sectionHeader(text) {
  return <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.24em", color: theme.accent, fontWeight: 700 }}>{text}</div>;
}

function EliteSavoryBuilder() {
  const [goal, setGoal] = useState("lean");
  const [proteinName, setProteinName] = useState("Chicken Breast");
  const [carbName, setCarbName] = useState("Rice Cooked");
  const [fatName, setFatName] = useState("Olive Oil");
  const [vegName, setVegName] = useState("Broccoli");
  const [style, setStyle] = useState("pan");
  const [category, setCategory] = useState("bowl");
  const [chefMode, setChefMode] = useState("chef");
  const [portionMode, setPortionMode] = useState("auto");
  const [tab, setTab] = useState("ingredients");
  const [custom, setCustom] = useState({ protein: 150, carb: 150, fat: 5, veg: 120 });

  const protein = savoryProteins.find((x) => x.name === proteinName);
  const carb = savoryCarbs.find((x) => x.name === carbName);
  const fat = savoryFats.find((x) => x.name === fatName);
  const veg = savoryVeg.find((x) => x.name === vegName);

  const recipe = useMemo(() => {
    const proteinG = portionMode === "custom" ? custom.protein : protein.grams[goal];
    const carbG = portionMode === "custom" ? custom.carb : carb.grams[goal];
    const fatG = fat.name === "None" ? 0 : (portionMode === "custom" ? custom.fat : fat.grams[goal]);
    const vegG = portionMode === "custom" ? custom.veg : veg.grams[goal];

    const total = addMacros([
      calcMacros(protein, proteinG),
      calcMacros(carb, carbG),
      calcMacros(fat, fatG),
      calcMacros(veg, vegG),
    ]);

    const estimatedTime = Math.max(
      style === "air_fryer" && carb.name === "Potato" ? 40 : carb.name === "Rice Cooked" ? 15 : carb.name === "Bagel" ? 8 : 12,
      protein.name === "Chicken Breast" ? 17 : protein.name === "Salmon" ? 14 : protein.name === "Lean Ground Beef 90/10" ? 13 : 8,
      veg.name === "Broccoli" ? 8 : 6
    );

    const timeline = [
      { name: carb.name, displayName: carb.name === "Rice Cooked" ? "Rice" : carb.name, startAt: 0, duration: estimatedTime, prepTime: 3, cookTime: estimatedTime - 3 },
      { name: protein.name, displayName: protein.name.replace(" Breast", "").replace(" 90/10", ""), startAt: Math.max(estimatedTime - 17, 0), duration: Math.min(17, estimatedTime), prepTime: 4, cookTime: Math.max(Math.min(17, estimatedTime) - 4, 1) },
      { name: veg.name, displayName: veg.name, startAt: Math.max(estimatedTime - 8, 0), duration: 8, prepTime: 2, cookTime: 6 },
    ].sort((a, b) => a.startAt - b.startAt);

    const steps = [
      `Start the ${carb.name.toLowerCase()} first so the longest component is already moving.`,
      `Prep the ${protein.name.toLowerCase()} while the ${carb.name.toLowerCase()} cooks.`,
      `Start the ${protein.name.toLowerCase()} with enough time for it to finish hot with the rest.`,
      `Cook the ${veg.name.toLowerCase()} near the end so it stays fresh and not overdone.`,
      `Add the ${fat.name.toLowerCase()} at the end for better texture and flavor.`,
      `Assemble as a ${category.replace("_", " ")} and serve immediately.`,
    ];

    return {
      title: `${goalLabels[goal]} ${protein.name} + ${carb.name}`,
      smartTitle: `${goalLabels[goal]} ${protein.name.replace(" Breast", "")} ${category === "bowl" ? "Power Bowl" : category === "sandwich" ? "Stack" : category === "breakfast" ? "Breakfast Build" : "Prep Box"} with ${carb.name === "Rice Cooked" ? "Rice" : carb.name}`,
      ingredients: [
        `${proteinG}g ${protein.name}`,
        `${carbG}g ${carb.name}`,
        fatG > 0 ? `${fatG}g ${fat.name}` : null,
        `${vegG}g ${veg.name}`,
      ].filter(Boolean),
      total,
      timeline,
      steps: chefMode === "quick" ? steps.slice(0, 4) : steps.concat([
        `Chef note: start the protein around minute ${Math.max(estimatedTime - 17, 0)} so everything lands together.`,
        `Chef finish: check seasoning and temperature in the final minute before plating.`,
      ]),
    };
  }, [goal, protein, carb, fat, veg, style, category, chefMode, portionMode, custom]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
      <div style={{ ...cardStyle, padding: 24 }}>
        <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 16, fontFamily: theme.headingFont }}>Savory Builder</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
          <SelectField label="Goal" value={goal} onChange={setGoal} options={Object.entries(goalLabels).map(([value, label]) => ({ value, label }))} />
          <SelectField label="Protein" value={proteinName} onChange={setProteinName} options={savoryProteins.map((x) => x.name)} />
          <SelectField label="Carb" value={carbName} onChange={setCarbName} options={savoryCarbs.map((x) => x.name)} />
          <SelectField label="Fat" value={fatName} onChange={setFatName} options={savoryFats.map((x) => x.name)} />
          <SelectField label="Vegetable" value={vegName} onChange={setVegName} options={savoryVeg.map((x) => x.name)} />
          <SelectField label="Cooking Style" value={style} onChange={setStyle} options={[{ value: "pan", label: "Pan" }, { value: "air_fryer", label: "Air Fryer" }, { value: "oven", label: "Oven" }, { value: "cold", label: "Cold Prep" }]} />
          <SelectField label="Meal Category" value={category} onChange={setCategory} options={[{ value: "bowl", label: "Bowl" }, { value: "sandwich", label: "Sandwich" }, { value: "breakfast", label: "Breakfast" }, { value: "meal_prep", label: "Meal Prep" }]} />
          <SelectField label="Chef Mode" value={chefMode} onChange={setChefMode} options={[{ value: "chef", label: "Chef" }, { value: "quick", label: "Quick" }]} />
          <SelectField label="Portion Mode" value={portionMode} onChange={setPortionMode} options={[{ value: "auto", label: "Auto" }, { value: "custom", label: "Custom" }]} />
        </div>

        {portionMode === "custom" && (
          <div style={{ marginTop: 14, padding: 14, borderRadius: 16, background: theme.bgSoft, border: `1px solid ${theme.border}` }}>
            {sectionHeader("Custom Meal Portions")}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 10 }}>
              <NumberField label="Protein (g)" value={custom.protein} onChange={(value) => setCustom((p) => ({ ...p, protein: value }))} helper={`${gramsToOunces(custom.protein)} oz`} />
              <NumberField label="Carb (g)" value={custom.carb} onChange={(value) => setCustom((p) => ({ ...p, carb: value }))} helper={`${gramsToOunces(custom.carb)} oz`} />
              <NumberField label="Fat (g)" value={custom.fat} onChange={(value) => setCustom((p) => ({ ...p, fat: value }))} helper={`${gramsToOunces(custom.fat)} oz`} />
              <NumberField label="Veg (g)" value={custom.veg} onChange={(value) => setCustom((p) => ({ ...p, veg: value }))} helper={`${gramsToOunces(custom.veg)} oz`} />
            </div>
          </div>
        )}
      </div>

      <div style={{ ...cardStyle, padding: 24 }}>
        {sectionHeader("Generated Savory Meal")}
        <h2 style={{ margin: "10px 0 8px", fontSize: 36, lineHeight: 1.08, fontFamily: theme.headingFont }}>{recipe.smartTitle}</h2>
        <div style={{ color: theme.accent, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{recipe.title}</div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))", gap: 12, marginBottom: 20 }}>
          <StatCard label="Calories" value={`${recipe.total.calories}`} />
          <StatCard label="Protein" value={`${recipe.total.protein}g`} />
          <StatCard label="Carbs" value={`${recipe.total.carbs}g`} />
          <StatCard label="Fat" value={`${recipe.total.fat}g`} />
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <button onClick={() => setTab("ingredients")} style={tabButtonStyle(tab === "ingredients")}>Ingredients</button>
          <button onClick={() => setTab("instructions")} style={tabButtonStyle(tab === "instructions")}>Instructions</button>
          <button onClick={() => setTab("timeline")} style={tabButtonStyle(tab === "timeline")}>Timeline</button>
        </div>

        {tab === "ingredients" && (
          <>
            <div style={{ marginBottom: 14, padding: 14, borderRadius: 16, background: theme.bgSoft, border: `1px solid ${theme.border}` }}>
              {sectionHeader("Portion Snapshot")}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginTop: 10 }}>
                <MiniPortionCard label={protein.name.replace(" Breast", "")} grams={portionMode === "custom" ? custom.protein : protein.grams[goal]} />
                <MiniPortionCard label={carb.name === "Rice Cooked" ? "Rice" : carb.name} grams={portionMode === "custom" ? custom.carb : carb.grams[goal]} />
                {fat.name !== "None" ? <MiniPortionCard label={fat.name} grams={portionMode === "custom" ? custom.fat : fat.grams[goal]} /> : null}
                <MiniPortionCard label={veg.name} grams={portionMode === "custom" ? custom.veg : veg.grams[goal]} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
              {recipe.ingredients.map((ingredient) => (
                <div key={ingredient} style={{ border: `1px solid ${theme.border}`, borderRadius: 18, padding: 16, background: theme.bgSoft }}>{ingredient}</div>
              ))}
            </div>
          </>
        )}

        {tab === "instructions" && (
          <div style={{ display: "grid", gap: 12 }}>
            {recipe.steps.map((instruction, index) => (
              <div key={index} style={{ display: "flex", gap: 14, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 16, background: theme.bgSoft }}>
                <div style={{ minWidth: 34, height: 34, borderRadius: 999, background: theme.accent, color: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 }}>{index + 1}</div>
                <div style={{ color: theme.subtext, lineHeight: 1.7 }}>{instruction}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "timeline" && (
          <div style={{ display: "grid", gap: 14 }}>
            {recipe.timeline.map((entry, index) => {
              const left = recipe.estimatedTime > 0 ? `${(entry.startAt / recipe.estimatedTime) * 100}%` : "0%";
              const width = recipe.estimatedTime > 0 ? `${(entry.duration / recipe.estimatedTime) * 100}%` : "0%";
              return (
                <div key={index} style={{ border: `1px solid ${theme.border}`, borderRadius: 18, padding: 16, background: theme.bgSoft }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                    <div style={{ color: theme.text, fontWeight: 700 }}>{entry.displayName}</div>
                    <div style={{ color: theme.accent, fontWeight: 700 }}>Start at {entry.startAt} min</div>
                  </div>
                  <div style={{ color: theme.subtext, lineHeight: 1.7, marginBottom: 8 }}>Duration: {entry.duration} min total • Prep: {entry.prepTime} min • Cook: {entry.cookTime} min</div>
                  <div style={{ position: "relative", height: 12, borderRadius: 999, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                    <div style={{ position: "absolute", left, width, top: 0, bottom: 0, borderRadius: 999, background: `linear-gradient(90deg, ${theme.accent} 0%, #e7c98f 100%)` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function EliteDessertBuilder() {
  const [goal, setGoal] = useState("lean");
  const [baseName, setBaseName] = useState("Greek Yogurt Nonfat");
  const [carbName, setCarbName] = useState("Oats Dry");
  const [addonName, setAddonName] = useState("Peanut Butter");
  const [style, setStyle] = useState("Ice Cream");
  const [flavor, setFlavor] = useState("Vanilla");
  const [portionMode, setPortionMode] = useState("auto");
  const [custom, setCustom] = useState({ base: 200, carb: 40, addon: 12 });

  const base = dessertBases.find((x) => x.name === baseName);
  const carb = dessertCarbs.find((x) => x.name === carbName);
  const addon = dessertAddons.find((x) => x.name === addonName);

  const recipe = useMemo(() => {
    const baseG = portionMode === "custom" ? custom.base : base.grams[goal];
    const carbG = portionMode === "custom" ? custom.carb : carb.grams[goal];
    const addonG = addon.name === "None" ? 0 : (portionMode === "custom" ? custom.addon : addon.grams[goal]);

    const total = addMacros([
      calcMacros(base, baseG),
      calcMacros(carb, carbG),
      calcMacros(addon, addonG),
    ]);

    const title = `${goalLabels[goal]} ${flavor} ${style}`;
    const smartTitle = `${goalLabels[goal]} ${flavor} ${style} Builder`;

    const stepsByStyle = {
      "Ice Cream": [
        "Blend all ingredients until completely smooth.",
        "Freeze the mixture until solid.",
        "Re-spin or blend again for a creamier finish.",
        "Add any topping last so texture stays clean.",
      ],
      "Cheesecake Bowl": [
        "Blend the base until smooth and creamy.",
        "Mix in the carb source for body and texture.",
        "Fold in any add-on last.",
        "Chill before serving for a thicker finish.",
      ],
      "Pudding": [
        "Whisk all ingredients until smooth.",
        "Let the mixture thicken.",
        "Adjust sweetness or flavor at the end.",
        "Serve chilled.",
      ],
      "Mug Cake": [
        "Mix ingredients until lump-free.",
        "Pour into a mug or small dish.",
        "Microwave or air fry until just set.",
        "Rest briefly before eating.",
      ],
      "Cookie Dough": [
        "Mix the base and dry ingredients until thick.",
        "Fold in add-on last.",
        "Chill if you want firmer texture.",
        "Serve as a bowl or bite-style dough.",
      ],
    };

    return {
      title,
      smartTitle,
      ingredients: [
        `${baseG}g ${base.name}`,
        `${carbG}g ${carb.name}`,
        addonG > 0 ? `${addonG}g ${addon.name}` : null,
        `${gramsToOunces(baseG)} oz base • ${gramsToOunces(carbG)} oz carb`,
      ].filter(Boolean),
      total,
      steps: stepsByStyle[style],
    };
  }, [goal, base, carb, addon, style, flavor, portionMode, custom]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
      <div style={{ ...cardStyle, padding: 24 }}>
        <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 16, fontFamily: theme.headingFont }}>Dessert Builder</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
          <SelectField label="Goal" value={goal} onChange={setGoal} options={Object.entries(goalLabels).map(([value, label]) => ({ value, label }))} />
          <SelectField label="Dessert Style" value={style} onChange={setStyle} options={dessertStyles} />
          <SelectField label="Flavor" value={flavor} onChange={setFlavor} options={["Vanilla", "Chocolate", "Strawberry", "Birthday Cake", "Biscoff", "Brownie Batter"]} />
          <SelectField label="Base" value={baseName} onChange={setBaseName} options={dessertBases.map((x) => x.name)} />
          <SelectField label="Carb" value={carbName} onChange={setCarbName} options={dessertCarbs.map((x) => x.name)} />
          <SelectField label="Add-on" value={addonName} onChange={setAddonName} options={dessertAddons.map((x) => x.name)} />
          <SelectField label="Portion Mode" value={portionMode} onChange={setPortionMode} options={[{ value: "auto", label: "Auto" }, { value: "custom", label: "Custom" }]} />
        </div>

        {portionMode === "custom" && (
          <div style={{ marginTop: 14, padding: 14, borderRadius: 16, background: theme.bgSoft, border: `1px solid ${theme.border}` }}>
            {sectionHeader("Custom Dessert Portions")}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 10 }}>
              <NumberField label="Base (g)" value={custom.base} onChange={(value) => setCustom((p) => ({ ...p, base: value }))} helper={`${gramsToOunces(custom.base)} oz`} />
              <NumberField label="Carb (g)" value={custom.carb} onChange={(value) => setCustom((p) => ({ ...p, carb: value }))} helper={`${gramsToOunces(custom.carb)} oz`} />
              <NumberField label="Add-on (g)" value={custom.addon} onChange={(value) => setCustom((p) => ({ ...p, addon: value }))} helper={`${gramsToOunces(custom.addon)} oz`} />
            </div>
          </div>
        )}
      </div>

      <div style={{ ...cardStyle, padding: 24 }}>
        {sectionHeader("Generated Dessert")}
        <h2 style={{ margin: "10px 0 8px", fontSize: 36, lineHeight: 1.08, fontFamily: theme.headingFont }}>{recipe.smartTitle}</h2>
        <div style={{ color: theme.accent, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{recipe.title}</div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))", gap: 12, marginBottom: 20 }}>
          <StatCard label="Calories" value={`${recipe.total.calories}`} />
          <StatCard label="Protein" value={`${recipe.total.protein}g`} />
          <StatCard label="Carbs" value={`${recipe.total.carbs}g`} />
          <StatCard label="Fat" value={`${recipe.total.fat}g`} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 16 }}>
          {recipe.ingredients.map((ingredient) => (
            <div key={ingredient} style={{ border: `1px solid ${theme.border}`, borderRadius: 18, padding: 16, background: theme.bgSoft }}>{ingredient}</div>
          ))}
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {recipe.steps.map((instruction, index) => (
            <div key={index} style={{ display: "flex", gap: 14, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 16, background: theme.bgSoft }}>
              <div style={{ minWidth: 34, height: 34, borderRadius: 999, background: theme.accent, color: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 }}>{index + 1}</div>
              <div style={{ color: theme.subtext, lineHeight: 1.7 }}>{instruction}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniPortionCard({ label, grams }) {
  return (
    <div style={{ border: `1px solid ${theme.border}`, borderRadius: 14, padding: 12, background: "rgba(255,255,255,0.02)" }}>
      <div style={{ color: theme.subtext, fontSize: 12, marginBottom: 6 }}>{label}</div>
      <div style={{ color: theme.text, fontWeight: 700 }}>{grams}g</div>
      <div style={{ color: theme.subtext, fontSize: 12 }}>{gramsToOunces(grams)} oz</div>
    </div>
  );
}

export default function Page() {
  const [appTab, setAppTab] = useState("dessert");

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text, fontFamily: theme.bodyFont }}>
      <div style={{ maxWidth: 1380, margin: "0 auto", padding: 20 }}>
        <div style={{ ...cardStyle, padding: 28, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ maxWidth: 820 }}>
              {sectionHeader("Sclass Fitness")}
              <h1 style={{ margin: "10px 0 12px", fontSize: 52, lineHeight: 1.02, color: theme.text, fontFamily: theme.headingFont, letterSpacing: "0.02em" }}>
                Elite Recipe App
              </h1>
              <p style={{ margin: 0, color: theme.subtext, fontSize: 16, lineHeight: 1.7 }}>
                One luxury build with both worlds combined: your Dessert system and your Savory meal builder in a single elite app. Switch between tabs, generate macros, control portions, and build recipes without leaving the same platform.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <Tag>Dessert</Tag>
              <Tag>Savory</Tag>
              <Tag>Meal Plans</Tag>
              <Tag>Elite UI</Tag>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <button onClick={() => setAppTab("dessert")} style={tabButtonStyle(appTab === "dessert")}>Dessert Builder</button>
          <button onClick={() => setAppTab("savory")} style={tabButtonStyle(appTab === "savory")}>Savory Builder</button>
        </div>

        {appTab === "dessert" ? <EliteDessertBuilder /> : <EliteSavoryBuilder />}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginTop: 20 }}>
          <div style={{ ...cardStyle, padding: 20 }}>
            {sectionHeader("Dessert Side")}
            <div style={{ color: theme.subtext, lineHeight: 1.7, marginTop: 10 }}>
              Built for your dessert-style recipe generation with cleaner builder controls, smart flavor flow, and portion editing for client use.
            </div>
          </div>
          <div style={{ ...cardStyle, padding: 20 }}>
            {sectionHeader("Savory Side")}
            <div style={{ color: theme.subtext, lineHeight: 1.7, marginTop: 10 }}>
              Keeps the savory standard you approved for regular meals, including timeline logic, chef mode, and meal-plan portion entry.
            </div>
          </div>
          <div style={{ ...cardStyle, padding: 20 }}>
            {sectionHeader("Combined App")}
            <div style={{ color: theme.subtext, lineHeight: 1.7, marginTop: 10 }}>
              This gives you one stronger product foundation for future updates instead of managing separate apps for desserts and regular meals.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
