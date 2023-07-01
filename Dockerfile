FROM public.ecr.aws/docker/library/node:18.16.1

RUN apt-get update && apt-get install -y \
  git \
  vim

# AWS CLI v2のインストール
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
  && unzip awscliv2.zip \
  && ./aws/install \
  && rm -rf awscliv2.zip aws

# NPMのアップデート
RUN npm install -g npm

USER node

# NPMのグローバルパッケージをnodeユーザのローカルに設定
RUN mkdir "${HOME}/.npm-packages" \
  && npm config set prefix "${HOME}/.npm-packages" \
  && echo 'NPM_PACKAGES="${HOME}/.npm-packages"' >> ~/.bashrc \
  && echo 'export PATH="$PATH:$NPM_PACKAGES/bin"' >> ~/.bashrc \
  && echo 'MANPATH="${MANPATH-$(manpath)}:$NPM_PACKAGES/share/man"'
RUN ["/bin/bash", "-c", "source ~/.bashrc"]


# Nodeパッケージインストール
RUN npm install -g \
  @nestjs/cli