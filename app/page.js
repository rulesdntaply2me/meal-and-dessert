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

const cardStyle = {
  background: `linear-gradient(180deg, ${theme.card} 0%, ${theme.cardAlt} 100%)`,
  border: `1px solid ${theme.border}`,
  borderRadius: 24,
  boxShadow: "0 14px 40px rgba(0,0,0,0.34)",
};

const sectionTitleStyle = {
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.24em",
  color: theme.accent,
  fontWeight: 700,
};

const selectStyle = {
  height: 50,
  borderRadius: 16,
  border: `1px solid ${theme.border}`,
  padding: "0 14px",
  fontSize: 15,
  background: theme.bgSoft,
  color: theme.text,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

const goalLabels = {
  low_cal: "Low Cal",
  lean: "Lean",
  anabolic: "Anabolic",
  bulk: "Bulk",
};

const savoryGoalDescriptions = {
  low_cal: "Lower calories, higher volume, clean and filling.",
  lean: "Balanced performance meal with strong protein and moderate carbs.",
  anabolic: "Higher protein focus with enough carbs to perform and recover.",
  bulk: "More total energy, more carbs and fats, still anchored by protein.",
};

const dessertGoalDescriptions = {
  low_cal: "Lower calorie dessert build with tighter carb and fat control.",
  lean: "Balanced dessert build with cleaner macros and strong texture.",
  anabolic: "Higher protein dessert build for performance and recovery.",
  bulk: "Higher energy dessert build with more carbs and fats.",
};

function round1(num) {
  return Math.round(num * 10) / 10;
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

function addMacros(parts) {
  return parts.reduce(
    (acc, part) => ({
      calories: round1(acc.calories + (part?.calories || 0)),
      protein: round1(acc.protein + (part?.protein || 0)),
      carbs: round1(acc.carbs + (part?.carbs || 0)),
      fat: round1(acc.fat + (part?.fat || 0)),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

function gramsToOunces(grams) {
  return round1(grams / 28.3495);
}

function optionLabel(name) {
  return name.replace(" Cooked", "").replace(" Dry", "").replace(" Nonfat", "").replace(" Low-Fat", "");
}

const savoryProteins = [
  { name: "Chicken Breast Cooked", macrosPer100: { calories: 165, protein: 31, carbs: 0, fat: 3.6 }, grams: { low_cal: 130, lean: 150, anabolic: 200, bulk: 180 }, cookTime: 17 },
  { name: "Lean Ground Beef 90/10", macrosPer100: { calories: 176, protein: 26, carbs: 0, fat: 10 }, grams: { low_cal: 120, lean: 150, anabolic: 140, bulk: 180 }, cookTime: 13 },
  { name: "Turkey Breast Deli", macrosPer100: { calories: 104, protein: 17, carbs: 3, fat: 2 }, grams: { low_cal: 100, lean: 120, anabolic: 150, bulk: 140 }, cookTime: 4 },
  { name: "Salmon", macrosPer100: { calories: 208, protein: 20, carbs: 0, fat: 13 }, grams: { low_cal: 120, lean: 150, anabolic: 150, bulk: 180 }, cookTime: 14 },
  { name: "Tuna Can In Water", macrosPer100: { calories: 116, protein: 26, carbs: 0, fat: 1 }, grams: { low_cal: 120, lean: 140, anabolic: 180, bulk: 160 }, cookTime: 3 },
  { name: "Egg White", macrosPer100: { calories: 52, protein: 11, carbs: 1, fat: 0.2 }, grams: { low_cal: 200, lean: 220, anabolic: 280, bulk: 220 }, cookTime: 8 },
  { name: "Whole Egg", macrosPer100: { calories: 143, protein: 13, carbs: 1, fat: 10 }, grams: { low_cal: 100, lean: 100, anabolic: 120, bulk: 150 }, cookTime: 8 },
  { name: "Greek Yogurt Nonfat", macrosPer100: { calories: 59, protein: 10, carbs: 3.6, fat: 0.4 }, grams: { low_cal: 170, lean: 200, anabolic: 250, bulk: 220 }, cookTime: 2 },
  { name: "Cottage Cheese Low-Fat", macrosPer100: { calories: 81, protein: 10.5, carbs: 4, fat: 2.3 }, grams: { low_cal: 150, lean: 180, anabolic: 220, bulk: 200 }, cookTime: 2 },
  { name: "Whey Isolate", macrosPer100: { calories: 372, protein: 86, carbs: 4, fat: 2 }, grams: { low_cal: 25, lean: 30, anabolic: 40, bulk: 35 }, cookTime: 1 },
];

const savoryCarbs = [
  { name: "Rice Cooked", macrosPer100: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 }, grams: { low_cal: 100, lean: 150, anabolic: 120, bulk: 220 }, cookTime: 15 },
  { name: "Potato", macrosPer100: { calories: 87, protein: 1.9, carbs: 20, fat: 0.1 }, grams: { low_cal: 120, lean: 200, anabolic: 150, bulk: 280 }, cookTime: 40 },
  { name: "Sweet Potato", macrosPer100: { calories: 86, protein: 1.6, carbs: 20, fat: 0.1 }, grams: { low_cal: 120, lean: 180, anabolic: 150, bulk: 250 }, cookTime: 35 },
  { name: "Bread", macrosPer100: { calories: 265, protein: 9, carbs: 49, fat: 3.2 }, grams: { low_cal: 50, lean: 60, anabolic: 60, bulk: 100 }, cookTime: 4 },
  { name: "Bagel", macrosPer100: { calories: 250, protein: 10, carbs: 49, fat: 1.5 }, grams: { low_cal: 55, lean: 75, anabolic: 75, bulk: 110 }, cookTime: 8 },
  { name: "Cream of Rice Dry", macrosPer100: { calories: 370, protein: 6.7, carbs: 83, fat: 0.6 }, grams: { low_cal: 25, lean: 40, anabolic: 45, bulk: 70 }, cookTime: 6 },
  { name: "Oats Dry", macrosPer100: { calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9 }, grams: { low_cal: 25, lean: 40, anabolic: 40, bulk: 70 }, cookTime: 6 },
  { name: "Banana", macrosPer100: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3 }, grams: { low_cal: 60, lean: 100, anabolic: 100, bulk: 140 }, cookTime: 1 },
  { name: "Blueberries", macrosPer100: { calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3 }, grams: { low_cal: 60, lean: 80, anabolic: 80, bulk: 120 }, cookTime: 1 },
  { name: "Apple", macrosPer100: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 }, grams: { low_cal: 80, lean: 120, anabolic: 120, bulk: 180 }, cookTime: 2 },
  { name: "White Rice Cake", macrosPer100: { calories: 387, protein: 8, carbs: 81, fat: 3 }, grams: { low_cal: 18, lean: 27, anabolic: 27, bulk: 45 }, cookTime: 1 },
];

const savoryFats = [
  { name: "None", macrosPer100: { calories: 0, protein: 0, carbs: 0, fat: 0 }, grams: { low_cal: 0, lean: 0, anabolic: 0, bulk: 0 } },
  { name: "Peanut Butter", macrosPer100: { calories: 588, protein: 25, carbs: 20, fat: 50 }, grams: { low_cal: 8, lean: 12, anabolic: 10, bulk: 24 } },
  { name: "Almonds", macrosPer100: { calories: 579, protein: 21, carbs: 22, fat: 50 }, grams: { low_cal: 10, lean: 15, anabolic: 15, bulk: 28 } },
  { name: "Avocado", macrosPer100: { calories: 160, protein: 2, carbs: 9, fat: 15 }, grams: { low_cal: 25, lean: 40, anabolic: 35, bulk: 70 } },
  { name: "Olive Oil", macrosPer100: { calories: 884, protein: 0, carbs: 0, fat: 100 }, grams: { low_cal: 0, lean: 5, anabolic: 5, bulk: 15 } },
  { name: "Whole Egg", macrosPer100: { calories: 143, protein: 13, carbs: 1, fat: 10 }, grams: { low_cal: 50, lean: 50, anabolic: 50, bulk: 100 } },
];

const savoryVeg = [
  { name: "Broccoli", macrosPer100: { calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4 }, grams: { low_cal: 180, lean: 120, anabolic: 150, bulk: 100 }, cookTime: 8 },
  { name: "Green Beans", macrosPer100: { calories: 31, protein: 1.8, carbs: 7, fat: 0.1 }, grams: { low_cal: 180, lean: 120, anabolic: 150, bulk: 100 }, cookTime: 8 },
  { name: "Asparagus", macrosPer100: { calories: 20, protein: 2.2, carbs: 3.9, fat: 0.1 }, grams: { low_cal: 180, lean: 120, anabolic: 150, bulk: 100 }, cookTime: 7 },
  { name: "Spinach", macrosPer100: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 }, grams: { low_cal: 120, lean: 80, anabolic: 100, bulk: 60 }, cookTime: 4 },
  { name: "Mixed Salad Greens", macrosPer100: { calories: 17, protein: 1.8, carbs: 3.2, fat: 0.2 }, grams: { low_cal: 120, lean: 80, anabolic: 100, bulk: 60 }, cookTime: 2 },
  { name: "Bell Peppers", macrosPer100: { calories: 31, protein: 1, carbs: 6, fat: 0.3 }, grams: { low_cal: 150, lean: 100, anabolic: 120, bulk: 80 }, cookTime: 5 },
  { name: "Zucchini", macrosPer100: { calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3 }, grams: { low_cal: 180, lean: 120, anabolic: 140, bulk: 100 }, cookTime: 5 },
  { name: "Cauliflower", macrosPer100: { calories: 25, protein: 1.9, carbs: 5, fat: 0.3 }, grams: { low_cal: 180, lean: 120, anabolic: 150, bulk: 100 }, cookTime: 8 },
];

const savoryFlavors = [
  "Garlic Herb",
  "Spicy",
  "Lemon Fresh",
  "Creamy Protein",
  "Sweet Savory",
];

const dessertBases = [
  { name: "Greek Yogurt Nonfat", macrosPer100: { calories: 59, protein: 10, carbs: 3.6, fat: 0.4 }, grams: { low_cal: 170, lean: 200, anabolic: 250, bulk: 220 } },
  { name: "Cottage Cheese Low-Fat", macrosPer100: { calories: 81, protein: 10.5, carbs: 4, fat: 2.3 }, grams: { low_cal: 150, lean: 180, anabolic: 220, bulk: 200 } },
  { name: "Whey Isolate", macrosPer100: { calories: 372, protein: 86, carbs: 4, fat: 2 }, grams: { low_cal: 25, lean: 30, anabolic: 40, bulk: 35 } },
  { name: "Egg White", macrosPer100: { calories: 52, protein: 11, carbs: 1, fat: 0.2 }, grams: { low_cal: 150, lean: 180, anabolic: 240, bulk: 200 } },
];

const dessertCarbs = [
  { name: "Oats Dry", macrosPer100: { calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9 }, grams: { low_cal: 25, lean: 40, anabolic: 40, bulk: 70 } },
  { name: "Cream of Rice Dry", macrosPer100: { calories: 370, protein: 6.7, carbs: 83, fat: 0.6 }, grams: { low_cal: 25, lean: 40, anabolic: 45, bulk: 70 } },
  { name: "Banana", macrosPer100: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3 }, grams: { low_cal: 60, lean: 100, anabolic: 100, bulk: 140 } },
  { name: "Blueberries", macrosPer100: { calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3 }, grams: { low_cal: 60, lean: 80, anabolic: 80, bulk: 120 } },
  { name: "Apple", macrosPer100: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 }, grams: { low_cal: 80, lean: 120, anabolic: 120, bulk: 180 } },
];

const dessertAddons = [
  { name: "None", macrosPer100: { calories: 0, protein: 0, carbs: 0, fat: 0 }, grams: { low_cal: 0, lean: 0, anabolic: 0, bulk: 0 } },
  { name: "Peanut Butter", macrosPer100: { calories: 588, protein: 25, carbs: 20, fat: 50 }, grams: { low_cal: 8, lean: 12, anabolic: 10, bulk: 24 } },
  { name: "Almonds", macrosPer100: { calories: 579, protein: 21, carbs: 22, fat: 50 }, grams: { low_cal: 10, lean: 15, anabolic: 15, bulk: 28 } },
];

const dessertStyles = [
  { name: "Ice Cream", flow: ["Blend", "Freeze", "Spin", "Serve"], totalTime: 12 },
  { name: "Cheesecake Bowl", flow: ["Blend", "Chill", "Fold", "Serve"], totalTime: 8 },
  { name: "Pudding", flow: ["Whisk", "Thicken", "Chill", "Serve"], totalTime: 7 },
  { name: "Mug Cake", flow: ["Mix", "Cook", "Rest", "Serve"], totalTime: 10 },
  { name: "Cookie Dough", flow: ["Mix", "Fold", "Chill", "Serve"], totalTime: 6 },
];

const dessertFlavors = [
  "Vanilla",
  "Banana",
  "Banana Nut",
  "Brownie Batter",
  "Strawberry Banana",
  "Cherry",
  "Lemon",
  "Apple Cinnamon",
  "Chocolate Chip",
  "Apple",
  "Pumpkin",
  "Carrot Cake",
  "Red Velvet",
  "Coconut",
  "Almond",
  "Peach",
  "Smores",
  "Mint",
  "Mint Chocolate",
  "Chocolate Strawberry",
  "Chocolate Banana",
  "Pecan",
  "Caramel",
  "Salted Caramel",
  "Chocolate",
  "Strawberry",
  "Birthday Cake",
  "Biscoff",
];

function SelectField({ label, value, onChange, options }) {
  return (
    <label style={{ display: "grid", gap: 8, minWidth: 0 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: theme.subtext, textTransform: "uppercase", letterSpacing: "0.12em" }}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={selectStyle}>
        {options.map((option) => {
          const val = typeof option === "string" ? option : option.value;
          const lab = typeof option === "string" ? option : option.label;
          return <option key={val} value={val}>{lab}</option>;
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

function MiniPortionCard({ label, grams }) {
  return (
    <div style={{ border: `1px solid ${theme.border}`, borderRadius: 14, padding: 12, background: "rgba(255,255,255,0.02)" }}>
      <div style={{ color: theme.subtext, fontSize: 12, marginBottom: 6 }}>{label}</div>
      <div style={{ color: theme.text, fontWeight: 700 }}>{grams}g</div>
      <div style={{ color: theme.subtext, fontSize: 12 }}>{gramsToOunces(grams)} oz</div>
    </div>
  );
}

function Tag({ children }) {
  return <span style={{ padding: "10px 14px", borderRadius: 999, border: `1px solid rgba(201,163,92,0.24)`, background: theme.accentSoft, color: theme.text, fontSize: 13, fontWeight: 700 }}>{children}</span>;
}

function InfoCard({ title, body }) {
  return (
    <div style={{ ...cardStyle, padding: 20, minWidth: 0 }}>
      <div style={{ ...sectionTitleStyle, marginBottom: 10 }}>{title}</div>
      <div style={{ color: theme.subtext, lineHeight: 1.7 }}>{body}</div>
    </div>
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

function BuilderShell({ title, description, controls, customBlock, recipe, tab, setTab, snapshotTitle, recipeSectionTitle }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
      <div style={{ ...cardStyle, padding: 24 }}>
        <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 16, fontFamily: theme.headingFont }}>{title}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>{controls}</div>
        <div style={{ marginTop: 14, padding: 14, borderRadius: 16, background: theme.bgSoft, border: `1px solid ${theme.border}` }}>
          <div style={{ ...sectionTitleStyle, marginBottom: 8 }}>Mode Guide</div>
          <div style={{ color: theme.subtext, fontSize: 13, lineHeight: 1.7 }}>
            <strong style={{ color: theme.text }}>Auto</strong> changes grams and macros when the goal changes. <strong style={{ color: theme.text }}>Custom</strong> keeps your typed grams locked.
          </div>
        </div>
        <p style={{ margin: "14px 0 0", color: theme.subtext, fontSize: 13, lineHeight: 1.6 }}>{description}</p>
        {customBlock}
      </div>

      <div style={{ ...cardStyle, padding: 24 }}>
        <div style={{ ...sectionTitleStyle, marginBottom: 10 }}>{recipeSectionTitle}</div>
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
              <div style={{ ...sectionTitleStyle, marginBottom: 8 }}>{snapshotTitle}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
                {recipe.snapshot.map((item) => <MiniPortionCard key={item.label} label={item.label} grams={item.grams} />)}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
              {recipe.ingredients.map((ingredient) => <div key={ingredient} style={{ border: `1px solid ${theme.border}`, borderRadius: 18, padding: 16, background: theme.bgSoft }}>{ingredient}</div>)}
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
              const left = recipe.totalTime > 0 ? `${(entry.startAt / recipe.totalTime) * 100}%` : "0%";
              const width = recipe.totalTime > 0 ? `${(entry.duration / recipe.totalTime) * 100}%` : "0%";
              return (
                <div key={index} style={{ border: `1px solid ${theme.border}`, borderRadius: 18, padding: 16, background: theme.bgSoft }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                    <div style={{ color: theme.text, fontWeight: 700 }}>{entry.displayName}</div>
                    <div style={{ color: theme.accent, fontWeight: 700 }}>Start at {entry.startAt} min</div>
                  </div>
                  <div style={{ color: theme.subtext, lineHeight: 1.7, marginBottom: 8 }}>Duration: {entry.duration} min total • Prep: {entry.prepTime} min • Action Time: {entry.cookTime} min</div>
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

function SavoryBuilder() {
  const [goal, setGoal] = useState("lean");
  const [proteinName, setProteinName] = useState("Chicken Breast Cooked");
  const [carbName, setCarbName] = useState("Rice Cooked");
  const [fatName, setFatName] = useState("Olive Oil");
  const [vegName, setVegName] = useState("Broccoli");
  const [flavor, setFlavor] = useState("Garlic Herb");
  const [chefMode, setChefMode] = useState("chef");
  const [portionMode, setPortionMode] = useState("auto");
  const [category, setCategory] = useState("bowl");
  const [custom, setCustom] = useState({ protein: 150, carb: 150, fat: 5, veg: 120 });
  const [tab, setTab] = useState("ingredients");

  const protein = savoryProteins.find((x) => x.name === proteinName);
  const carb = savoryCarbs.find((x) => x.name === carbName);
  const fat = savoryFats.find((x) => x.name === fatName);
  const veg = savoryVeg.find((x) => x.name === vegName);

  const recipe = useMemo(() => {
    const proteinG = portionMode === "custom" ? custom.protein : protein.grams[goal];
    const carbG = portionMode === "custom" ? custom.carb : carb.grams[goal];
    const fatG = fat.name === "None" ? 0 : (portionMode === "custom" ? custom.fat : fat.grams[goal]);
    const vegG = portionMode === "custom" ? custom.veg : veg.grams[goal];
    const total = addMacros([calcMacros(protein, proteinG), calcMacros(carb, carbG), calcMacros(fat, fatG), calcMacros(veg, vegG)]);

    const totalTime = Math.max(protein.cookTime, carb.cookTime, veg.cookTime, 1);
    const timeline = [
      { displayName: optionLabel(carb.name), startAt: Math.max(totalTime - carb.cookTime, 0), duration: carb.cookTime, prepTime: 3, cookTime: Math.max(carb.cookTime - 3, 1) },
      { displayName: optionLabel(protein.name), startAt: Math.max(totalTime - protein.cookTime, 0), duration: protein.cookTime, prepTime: 4, cookTime: Math.max(protein.cookTime - 4, 1) },
      { displayName: veg.name, startAt: Math.max(totalTime - veg.cookTime, 0), duration: veg.cookTime, prepTime: 2, cookTime: Math.max(veg.cookTime - 2, 1) },
    ].sort((a, b) => a.startAt - b.startAt);

    const baseSteps = [
      `Start the ${timeline[0].displayName.toLowerCase()} first because it takes the longest.`,
      `Prep the ${protein.name.toLowerCase()} while the first item cooks.`,
      `Cook the ${protein.name.toLowerCase()} so it finishes with the rest of the meal.`,
      `Cook the ${veg.name.toLowerCase()} near the end so it stays fresher.`,
      fatG > 0 ? `Add ${fat.name.toLowerCase()} at the end for better texture and flavor.` : `Skip added fat and keep the finish lighter.`,
      `Finish with the ${flavor.toLowerCase()} profile and serve as a ${category.replace("_", " ")}.`,
    ];

    const steps = chefMode === "quick" ? baseSteps.slice(0, 4) : baseSteps.concat([
      `Chef note: with goal set to ${goalLabels[goal]}, Auto mode changes the portions and macros automatically.`,
      `Final check: taste, texture, and temperature before plating.`,
    ]);

    return {
      title: `${goalLabels[goal]} ${optionLabel(protein.name)} + ${optionLabel(carb.name)}`,
      smartTitle: `${goalLabels[goal]} ${flavor} ${optionLabel(protein.name)} ${category === "bowl" ? "Power Bowl" : category === "sandwich" ? "Stack" : category === "breakfast" ? "Breakfast Build" : "Prep Box"}`,
      ingredients: [`${proteinG}g ${protein.name}`, `${carbG}g ${carb.name}`, fatG > 0 ? `${fatG}g ${fat.name}` : null, `${vegG}g ${veg.name}`].filter(Boolean),
      total,
      timeline,
      totalTime,
      steps,
      snapshot: [
        { label: optionLabel(protein.name), grams: proteinG },
        { label: optionLabel(carb.name), grams: carbG },
        ...(fatG > 0 ? [{ label: fat.name, grams: fatG }] : []),
        { label: veg.name, grams: vegG },
      ],
    };
  }, [goal, protein, carb, fat, veg, flavor, chefMode, portionMode, custom, category]);

  return (
    <BuilderShell
      title="Savory Builder"
      description={savoryGoalDescriptions[goal]}
      controls={
        <>
          <SelectField label="Goal" value={goal} onChange={setGoal} options={Object.entries(goalLabels).map(([value, label]) => ({ value, label }))} />
          <SelectField label="Flavor" value={flavor} onChange={setFlavor} options={savoryFlavors} />
          <SelectField label="Protein" value={proteinName} onChange={setProteinName} options={savoryProteins.map((x) => x.name)} />
          <SelectField label="Carb" value={carbName} onChange={setCarbName} options={savoryCarbs.map((x) => x.name)} />
          <SelectField label="Fat" value={fatName} onChange={setFatName} options={savoryFats.map((x) => x.name)} />
          <SelectField label="Vegetable" value={vegName} onChange={setVegName} options={savoryVeg.map((x) => x.name)} />
          <SelectField label="Chef Mode" value={chefMode} onChange={setChefMode} options={[{ value: "chef", label: "Chef" }, { value: "quick", label: "Quick" }]} />
          <SelectField label="Meal Category" value={category} onChange={setCategory} options={[{ value: "bowl", label: "Bowl" }, { value: "sandwich", label: "Sandwich" }, { value: "breakfast", label: "Breakfast" }, { value: "meal_prep", label: "Meal Prep" }]} />
          <SelectField label="Portion Mode" value={portionMode} onChange={setPortionMode} options={[{ value: "auto", label: "Auto" }, { value: "custom", label: "Custom" }]} />
        </>
      }
      customBlock={portionMode === "custom" ? (
        <div style={{ marginTop: 14, padding: 14, borderRadius: 16, background: theme.bgSoft, border: `1px solid ${theme.border}` }}>
          <div style={{ ...sectionTitleStyle, marginBottom: 10 }}>Custom Meal Portions</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            <NumberField label="Protein (g)" value={custom.protein} onChange={(v) => setCustom((p) => ({ ...p, protein: v }))} helper={`${gramsToOunces(custom.protein)} oz`} />
            <NumberField label="Carb (g)" value={custom.carb} onChange={(v) => setCustom((p) => ({ ...p, carb: v }))} helper={`${gramsToOunces(custom.carb)} oz`} />
            <NumberField label="Fat (g)" value={custom.fat} onChange={(v) => setCustom((p) => ({ ...p, fat: v }))} helper={`${gramsToOunces(custom.fat)} oz`} />
            <NumberField label="Veg (g)" value={custom.veg} onChange={(v) => setCustom((p) => ({ ...p, veg: v }))} helper={`${gramsToOunces(custom.veg)} oz`} />
          </div>
        </div>
      ) : null}
      recipe={recipe}
      tab={tab}
      setTab={setTab}
      snapshotTitle="Meal Plan Portion Snapshot"
      recipeSectionTitle="Generated Savory Meal"
    />
  );
}

function DessertBuilder() {
  const [goal, setGoal] = useState("lean");
  const [baseName, setBaseName] = useState("Greek Yogurt Nonfat");
  const [carbName, setCarbName] = useState("Oats Dry");
  const [addonName, setAddonName] = useState("Peanut Butter");
  const [styleName, setStyleName] = useState("Ice Cream");
  const [flavor, setFlavor] = useState("Vanilla");
  const [chefMode, setChefMode] = useState("chef");
  const [portionMode, setPortionMode] = useState("auto");
  const [custom, setCustom] = useState({ base: 200, carb: 40, addon: 12 });
  const [tab, setTab] = useState("ingredients");

  const base = dessertBases.find((x) => x.name === baseName);
  const carb = dessertCarbs.find((x) => x.name === carbName);
  const addon = dessertAddons.find((x) => x.name === addonName);
  const style = dessertStyles.find((x) => x.name === styleName);

  const recipe = useMemo(() => {
    const baseG = portionMode === "custom" ? custom.base : base.grams[goal];
    const carbG = portionMode === "custom" ? custom.carb : carb.grams[goal];
    const addonG = addon.name === "None" ? 0 : (portionMode === "custom" ? custom.addon : addon.grams[goal]);
    const total = addMacros([calcMacros(base, baseG), calcMacros(carb, carbG), calcMacros(addon, addonG)]);

    const totalTime = Math.max(style.totalTime, 1);
    const segment = Math.max(Math.floor(totalTime / style.flow.length), 1);
    const timeline = style.flow.map((step, index) => ({
      displayName: step,
      startAt: Math.min(index * segment, totalTime - 1),
      duration: index === style.flow.length - 1 ? Math.max(totalTime - index * segment, 1) : segment,
      prepTime: step === "Blend" || step === "Whisk" || step === "Mix" ? 2 : 1,
      cookTime: step === "Freeze" || step === "Chill" || step === "Cook" || step === "Spin" ? Math.max(segment - 1, 1) : 0,
    }));

    const baseSteps = [
      `Start with the ${style.name.toLowerCase()} base first because it controls the overall dessert texture.`,
      `${style.flow[0]} the base until smooth and consistent.`,
      `${style.flow[1]} the dessert to build the right body and texture.`,
      addonG > 0 ? `Add the ${addon.name.toLowerCase()} late so it stays noticeable in the final texture.` : `Skip the add-on and keep the dessert lighter and cleaner.`,
      `${style.flow[2]} the dessert if needed for the final texture.`,
      `Finish with the ${flavor.toLowerCase()} profile and ${style.flow[3].toLowerCase()} once the texture feels right.`,
    ];

    const steps = chefMode === "quick" ? baseSteps.slice(0, 4) : baseSteps.concat([
      `Chef note: dessert timing here is texture based, not hot-food timing based.`,
      `With goal set to ${goalLabels[goal]}, Auto mode changes the dessert grams and macros automatically.`,
    ]);

    return {
      title: `${goalLabels[goal]} ${flavor} ${style.name}`,
      smartTitle: `${goalLabels[goal]} ${flavor} ${style.name} Builder`,
      ingredients: [`${baseG}g ${base.name}`, `${carbG}g ${carb.name}`, addonG > 0 ? `${addonG}g ${addon.name}` : null].filter(Boolean),
      total,
      timeline,
      totalTime,
      steps,
      snapshot: [
        { label: optionLabel(base.name), grams: baseG },
        { label: optionLabel(carb.name), grams: carbG },
        ...(addonG > 0 ? [{ label: addon.name, grams: addonG }] : []),
      ],
    };
  }, [goal, base, carb, addon, style, flavor, chefMode, portionMode, custom]);

  return (
    <BuilderShell
      title="Dessert Builder"
      description={dessertGoalDescriptions[goal]}
      controls={
        <>
          <SelectField label="Goal" value={goal} onChange={setGoal} options={Object.entries(goalLabels).map(([value, label]) => ({ value, label }))} />
          <SelectField label="Dessert Style" value={styleName} onChange={setStyleName} options={dessertStyles.map((x) => x.name)} />
          <SelectField label="Flavor" value={flavor} onChange={setFlavor} options={dessertFlavors} />
          <SelectField label="Base" value={baseName} onChange={setBaseName} options={dessertBases.map((x) => x.name)} />
          <SelectField label="Carb" value={carbName} onChange={setCarbName} options={dessertCarbs.map((x) => x.name)} />
          <SelectField label="Add-on" value={addonName} onChange={setAddonName} options={dessertAddons.map((x) => x.name)} />
          <SelectField label="Chef Mode" value={chefMode} onChange={setChefMode} options={[{ value: "chef", label: "Chef" }, { value: "quick", label: "Quick" }]} />
          <SelectField label="Portion Mode" value={portionMode} onChange={setPortionMode} options={[{ value: "auto", label: "Auto" }, { value: "custom", label: "Custom" }]} />
        </>
      }
      customBlock={portionMode === "custom" ? (
        <div style={{ marginTop: 14, padding: 14, borderRadius: 16, background: theme.bgSoft, border: `1px solid ${theme.border}` }}>
          <div style={{ ...sectionTitleStyle, marginBottom: 10 }}>Custom Dessert Portions</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            <NumberField label="Base (g)" value={custom.base} onChange={(v) => setCustom((p) => ({ ...p, base: v }))} helper={`${gramsToOunces(custom.base)} oz`} />
            <NumberField label="Carb (g)" value={custom.carb} onChange={(v) => setCustom((p) => ({ ...p, carb: v }))} helper={`${gramsToOunces(custom.carb)} oz`} />
            <NumberField label="Add-on (g)" value={custom.addon} onChange={(v) => setCustom((p) => ({ ...p, addon: v }))} helper={`${gramsToOunces(custom.addon)} oz`} />
          </div>
        </div>
      ) : null}
      recipe={recipe}
      tab={tab}
      setTab={setTab}
      snapshotTitle="Dessert Portion Snapshot"
      recipeSectionTitle="Generated Dessert"
    />
  );
}

export default function Page() {
  const [appTab, setAppTab] = useState("savory");

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text, fontFamily: theme.bodyFont }}>
      <div style={{ maxWidth: 1380, margin: "0 auto", padding: 20 }}>
        <div style={{ ...cardStyle, padding: 28, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ maxWidth: 820 }}>
              <div style={sectionTitleStyle}>Sclass Fitness</div>
              <h1 style={{ margin: "10px 0 12px", fontSize: 52, lineHeight: 1.02, color: theme.text, fontFamily: theme.headingFont, letterSpacing: "0.02em" }}>
                Master Elite Recipe App
              </h1>
              <p style={{ margin: 0, color: theme.subtext, fontSize: 16, lineHeight: 1.7 }}>
                Expanded with your broader ingredient library and your full dessert flavor list. This is the master build going forward.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <Tag>Dessert</Tag>
              <Tag>Savory</Tag>
              <Tag>Expanded Items</Tag>
              <Tag>Full Flavors</Tag>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <button onClick={() => setAppTab("dessert")} style={tabButtonStyle(appTab === "dessert")}>Dessert Builder</button>
          <button onClick={() => setAppTab("savory")} style={tabButtonStyle(appTab === "savory")}>Savory Builder</button>
        </div>

        {appTab === "dessert" ? <DessertBuilder /> : <SavoryBuilder />}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginTop: 20 }}>
          <InfoCard title="Expanded Savory Library" body="Added your broader savory proteins, carbs, fats, and vegetables so the builder covers more of your real meal plan options." />
          <InfoCard title="Full Dessert Flavors" body="Added the larger dessert flavor list we built earlier so your flavor selector has more range for the dessert side." />
          <InfoCard title="Master App Base" body="This version is meant to be the stronger master foundation for future updates to both desserts and savory meals." />
        </div>
      </div>
    </div>
  );
}
