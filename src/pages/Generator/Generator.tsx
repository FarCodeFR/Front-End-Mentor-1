import { useEffect, useState } from "react";
import "./generator.css";

function Generator() {
	const [password, setPassword] = useState("Fdsgr3@D");
	const [lengthPassword, setLengthPassword] = useState(15);
	const [uppercase, setUppercase] = useState(true);
	const [lowercase, setLowercase] = useState(true);
	const [numbers, setNumbers] = useState(true);
	const [symbols, setSymbols] = useState(true);
	const [isRobust, setIsRobust] = useState("");
	const [isBar, setIsBar] = useState(0);
	const [colorBar, setColorBar] = useState("#555");
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		generatePassword();
		setTimeout(() => {
			setVisible(true);
		}, 100);
	}, []);

	const random = (min = 0, max = 1) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	const randomLower = () => {
		const alphabet = "abcdefghijklmnopqrstuvwxyz";
		return alphabet[random(0, alphabet.length - 1)];
	};
	const randomUpper = () => {
		const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		return alphabet[random(0, alphabet.length - 1)];
	};
	const randomSymbol = () => {
		const symbols = "!@#$%^&*(){}[]=<>/,.";
		return symbols[random(0, symbols.length - 1)];
	};

	const generatePassword = () => {
		let password = "";
		for (let i = 0; i < lengthPassword; i++) {
			const choice = random(0, 3);
			if (lowercase && choice === 0) {
				password += randomLower();
			} else if (uppercase && choice === 1) {
				password += randomUpper();
			} else if (symbols && choice === 2) {
				password += randomSymbol();
			} else if (numbers && choice === 3) {
				password += random(0, 9);
			} else {
				i--;
			}
		}
		setPassword(password);
	};

	const forcePassword = () => {
		if (lengthPassword < 8) {
			setIsRobust("FAIBLE");
			setIsBar(1);
			setColorBar("red");
		} else if (lengthPassword < 15) {
			setIsRobust("MOYEN");
			setIsBar(3);
			setColorBar("orange");
		} else if (lengthPassword >= 15) {
			setIsRobust("FORT");
			setIsBar(5);
			setColorBar("green");
		} else {
			setIsRobust("NULL");
			setIsBar(0);
			setColorBar("#555");
		}
	};

	const bars = Array.from({ length: 5 }, (_, id: number) => (
		<div
			// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
			key={id}
			className="bar"
			style={{ backgroundColor: id < isBar ? colorBar : "#555" }}
		>
			.
		</div>
	));
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLengthPassword(Number(e.target.value));
		forcePassword();
	};

	const handleCopy = async () => {
		try {
			await navigator.clipboard.write([
				new ClipboardItem({
					"text/plain": new Blob([password], { type: "text/plain" }),
				}),
			]);
			alert("Mot de passe copié !");
		} catch (err) {
			console.error(err);
		}
	};
	return (
		<main className={`container-generator-main ${visible ? "visible" : ""}`}>
			<h1>Générateur de mots de passe</h1>
			<div className="input-with-button">
				<input type="text" value={password} readOnly />
				<button type="button" onClick={handleCopy}>
					<img src="images/copy.png" alt="" />
				</button>
			</div>
			<section className="container-generator">
				<label htmlFor="Length">Longueur du mot de passe</label>
				<input
					type="range"
					id="Length"
					value={lengthPassword}
					onChange={handleChange}
					name="longeur"
					min="0"
					max="30"
				/>
				<p>{lengthPassword}</p>
				<section className="container-checkbox">
					<div>
						<input
							type="checkbox"
							id="uppercase"
							checked={uppercase}
							onChange={(e) => setUppercase(e.target.checked)}
						/>
						<label htmlFor="uppercase">Majuscule</label>
					</div>
					<div>
						<input
							type="checkbox"
							id="lowercase"
							checked={lowercase}
							onChange={(e) => setLowercase(e.target.checked)}
						/>
						<label htmlFor="lowercase">Minuscule</label>
					</div>
					<div>
						<input
							type="checkbox"
							id="numbers"
							checked={numbers}
							onChange={(e) => setNumbers(e.target.checked)}
						/>
						<label htmlFor="numbers">Chiffres</label>
					</div>
					<div>
						<input
							type="checkbox"
							id="symboles"
							checked={symbols}
							onChange={(e) => setSymbols(e.target.checked)}
						/>
						<label htmlFor="symboles">Symboles</label>
					</div>
				</section>
				<div className="strength-indicator">
					<span className="label">FORCE</span>
					<span className="level">{isRobust}</span>
					<div className="bars-container">{bars}</div>
				</div>
				<button
					className="button-generator"
					type="button"
					onClick={generatePassword}
				>
					Générer
				</button>
			</section>
		</main>
	);
}

export default Generator;
