### starkliup
>>> curl https://get.starkli.sh | sh

### asdf
>>> brew install coreutils curl git
>>> brew install asdf
>>> echo -e "\n. $(brew --prefix asdf)/libexec/asdf.sh" >> ${ZDOTDIR:-~}/.zshrc

### scarb
>>> asdf plugin add scarb
>>> asdf install scarb latest
>>> asdf global scarb latest

### starknet foundry
>>> asdf plugin add starknet-foundry
>>> asdf install starknet-foundry latest
>>> asdf global starknet-foundry latest

### Setup symbolic link if needed
>>> ln -s  ~/.asdf/installs/starknet-foundry/0.35.1/bin/sncast ~/.local/bin/sncast
>>> asdf which sncast then setup symbolic link
>>> asdf which snforge then setup symbolic link

### rustc
>>> curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh